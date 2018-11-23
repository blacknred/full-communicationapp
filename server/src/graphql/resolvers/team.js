import {
    requiresAuth,
    requiresTeamAccess,
    requiresTeamAdminAccess,
} from '../../permissions';
import redisClient from '../../redis';
import emailTransporter from '../../email';
import { createInviteToken } from '../../auth';
import formateErrors from '../../formateErrors';

export default {
    Team: {
        admin: ({ id }, _, { models }) => models.sequelize.query(
            `select u.id, u.username from users as u
            join team_members as tm on u.id = tm.user_id
            where tm.team_id = ? and tm.admin = true`,
            {
                replacements: [id],
                model: models.User,
                raw: true,
            },
        ).then(users => users[0]),
        channels: ({ id }, _, { models, user }) => models.sequelize
            .query(
                `select distinct on (id) *,
                case
                when sc.channel_id is not null and sc.user_id = :userId
                then true else false
                end as starred
                from channels as c
                left outer join private_channel_members as pcm
                on c.id = pcm.channel_id
                left outer join starred_channels as sc
                on c.id = sc.channel_id
                where c.team_id = :teamId
                and (c.private = false or pcm.user_id = :userId)`,
                {
                    replacements: { teamId: id, userId: user.id },
                    model: models.Channel,
                    raw: true,
                },
            ),
        // chatMembers: ({ id }, _, { models, user }) => models.sequelize
        //     .query(
        //         `select distinct on (u.id) u.id, u.username from users as u
        //         join direct_messages as dm
        //         on (u.id = dm.sender_id) or (u.id = dm.receiver_id)
        //         where (:currentUserId = dm.sender_id or :currentUserId = dm.receiver_id)
        //         and dm.team_id = :teamId`,
        //         {
        //             replacements: { currentUserId: user.id, teamId: id },
        //             model: models.User,
        //             raw: true,
        //         },
        //     ),
        updatesCount: async ({ id }, _, { models, user }) => {
            const lastVisit = await redisClient.getAsync(`user_${user.id}_online`);
            const [{ count }] = await models.sequelize.query(
                `select count(*) from messages as m
                join channels as c on m.channel_id = c.id
                join teams as t on c.team_id = t.id
                where t.id = :teamId and m.created_at > to_timestamp(:lastVisit)`,
                {
                    replacements: { teamId: id, lastVisit },
                    model: models.Message,
                    raw: true,
                },
            );
            return count;
        },
        membersCount: ({ id }, _, { models }) => models.TeamMember
            .count({ where: { teamId: id } }),
    },
    Query: {
        getTeams: requiresAuth.createResolver(
            (_, __, { models, user }) => models.sequelize.query(
                `select * from teams as t
                join team_members as tm on t.id = tm.team_id
                where tm.user_id = ?`,
                {
                    replacements: [user.id],
                    model: models.Team,
                    raw: true,
                },
            ),
        ),
        getTeamMembers: requiresTeamAccess.createResolver(
            (_, { teamId }, { models }) => models.sequelize.query(
                `select * from users as u
                join team_members as tm on tm.user_id = u.id
                where tm.team_id = ?`,
                {
                    replacements: [teamId],
                    model: models.User,
                    raw: true,
                },
            ),
        ),
    },
    Mutation: {
        createTeam: requiresAuth.createResolver(
            async (_, args, { models, user }) => {
                try {
                    // check if team with this name exists
                    const isExist = await models.Team.findOne({
                        where: { name: args.name },
                        raw: true,
                    });
                    if (isExist) {
                        return {
                            ok: false,
                            errors: [{
                                path: 'name',
                                message: 'The team with this name already exists',
                            }],
                        };
                    }
                    const team = await models.sequelize
                        .transaction(async (transaction) => {
                            // create a new team
                            const newTeam = await models.Team.create(
                                { ...args },
                                { transaction },
                            );

                            // create a 'general' public channel
                            const channel = await models.Channel.create(
                                {
                                    name: 'general',
                                    private: false,
                                    teamId: newTeam.dataValues.id,
                                },
                                { transaction },
                            );

                            // create a team admin entry
                            await models.TeamMember.create(
                                {
                                    teamId: newTeam.dataValues.id,
                                    userId: user.id,
                                    admin: true,
                                },
                                { transaction },
                            );

                            // create announcement message in channel
                            await models.Message.create({
                                text: 'Channel was created!',
                                userId: user.id,
                                announcement: true,
                                channel_id: channel.dataValues.id,
                            });

                            return newTeam;
                        });

                    return {
                        ok: true,
                        team,
                    };
                } catch (err) {
                    return {
                        ok: false,
                        errors: formateErrors(err, models),
                    };
                }
            },
        ),
        addTeamMember: requiresTeamAdminAccess.createResolver(
            async (_, { teamId, email }, { models }) => {
                try {
                    // check if valid email
                    if (!/\S+@\S+/.test(email)) {
                        return {
                            ok: false,
                            errors: [{
                                path: 'email',
                                message: 'Not valid url',
                            }],
                        };
                    }

                    // check if new member is a valid user
                    // if not, create short lived token -
                    // an invitation to the team and send it by email
                    const isValidUser = await models.User.findOne({
                        where: { email }, raw: true,
                    });
                    if (!isValidUser) {
                        const team = await models.Team.findById(teamId);
                        const token = createInviteToken({ teamId, email });
                        await emailTransporter.sendMail({
                            from: 'swoy-inviteservice@gmail.com',
                            to: email,
                            subject: `Invitation to team ${team.name}`,
                            html: `
                            <div>
                            <h1><i>Hello</i> from SWOY corporate messenger</h1>
                            <h2>You have received invitation to the team
                            ${team.name.charAt(0).toUpperCase() + team.name.substr(1)}.</h2>
                            <p>
                            Just use the link to continue.<br />
                            (This link will expire in 1 day.)
                            </p>
                            <a href="http://localhost:4000/login?token=${token}&email=${email}">
                            <b>INVITATION LINK</b>
                            </a>
                            </div>
                            `,
                        });
                        return {
                            ok: true,
                            status: 'Invitation was send',
                        };
                    }

                    // check if user is already the team member
                    const isMember = await models.sequelize
                        .query(
                            `select * from team_members as tm
                            join users as u on u.id = tm.user_id
                            where u.email = :email and tm.team_id = :teamId`,
                            {
                                replacements: { email, teamId },
                                model: models.TeamMember,
                                raw: true,
                            },
                        );
                    if (isMember.length) {
                        return {
                            ok: false,
                            errors: [{
                                path: 'email',
                                message: 'The user allready in the team',
                            }],
                        };
                    }

                    // create a entry for new team member
                    await models.TeamMember.create({
                        userId: isValidUser.id,
                        teamId,
                    });

                    return {
                        ok: true,
                        status: 'New member was added',
                    };
                } catch (err) {
                    return {
                        ok: false,
                        errors: formateErrors(err, models),
                    };
                }
            },
        ),
        updateTeam: requiresTeamAdminAccess.createResolver(
            async (_, { teamId, ...args }, { models }) => {
                try {
                    // check if team name was changed with the name that already exists
                    const isExist = await models.Team.findOne({
                        where: { name: args.name.toLowerCase() },
                        raw: true,
                    });
                    if (isExist && isExist.id !== teamId) {
                        return {
                            ok: false,
                            errors: [{
                                path: 'name',
                                message: 'The team with this name already exists',
                            }],
                        };
                    }
                    const [, updatedTeam] = await models.Team.update(
                        args,
                        {
                            where: { id: teamId },
                            returning: true,
                        },
                    );
                    return {
                        ok: true,
                        team: updatedTeam[0],
                    };
                } catch (err) {
                    return {
                        ok: false,
                        errors: formateErrors(err, models),
                    };
                }
            },
        ),
        deleteTeam: requiresTeamAdminAccess.createResolver(
            async (_, { teamId }, { models }) => {
                try {
                    let channelsIds = await models.Channel.findAll(
                        { where: { teamId } },
                        { row: true },
                    );
                    channelsIds = channelsIds.map(m => m.id);
                    console.log(channelsIds);
                    // delete the team, channels, private channel members, channel messages
                    await models.sequelize.transaction(async (transaction) => {
                        await models.Message.destroy(
                            { where: { channel_id: channelsIds } },
                            { transaction },
                        );
                        await models.PrivateChannelMember.destroy(
                            { where: { channel_id: channelsIds } },
                            { transaction },
                        );
                        await models.Channel.destroy(
                            { where: { id: channelsIds } },
                            { transaction },
                        );
                        await models.Team.destroy(
                            { where: { id: teamId } },
                            { transaction },
                        );
                    });

                    return true;
                } catch (err) {
                    return false;
                }
            },
        ),
    },
};
