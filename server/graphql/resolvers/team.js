import redisClient from '../../redis';
import emailTransporter from '../../email';
import { createInviteToken } from '../../auth';
import formateErrors from '../../formateErrors';
import { requiresAuth, requiresTeamAdminAccess } from '../../permissions';

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
                `select distinct on (id) * from channels as c 
                left outer join private_channel_members as pcm
                on c.id = pcm.channel_id
                left outer join starred_channels as sc on c.id = sc.channel_id
                where c.team_id = :teamId
                and (c.private = false or pcm.user_id = :userId)
                and sc.channel_id is null`,
                {
                    replacements: { teamId: id, userId: user.id },
                    model: models.Channel,
                    raw: true,
                },
            ),
        starredChannels: ({ id }, _, { models, user }) => models.sequelize
            .query(
                `select distinct on (id) * from channels as c 
                left outer join starred_channels as sc on c.id = sc.channel_id
                where c.team_id = :teamId and sc.user_id = :userId`,
                {
                    replacements: { teamId: id, userId: user.id },
                    model: models.Channel,
                    raw: true,
                },
            ),
        directMessageMembers: ({ id }, _, { models, user }) => models.sequelize
            .query(
                `select distinct on (u.id) u.id, u.username from users as u
                join direct_messages as dm
                on (u.id = dm.sender_id) or (u.id = dm.receiver_id)
                where (:currentUserId = dm.sender_id or :currentUserId = dm.receiver_id)
                and dm.team_id = :teamId`,
                {
                    replacements: { currentUserId: user.id, teamId: id },
                    model: models.User,
                    raw: true,
                },
            ),
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
        getTeamMembers: requiresAuth.createResolver(
            (_, { teamId }, { models }) => models.sequelize.query(
                `select * from users as u
                join team_member as tm on tm.user_id = u.id
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
                                message: 'The team with this name allready exists',
                            }],
                        };
                    }
                    const res = await models.sequelize
                        .transaction(async (transaction) => {
                            // create a new team
                            const team = await models.Team.create(
                                { ...args },
                                { transaction },
                            );

                            // create a 'general' public channel
                            await models.Channel.create(
                                {
                                    name: 'general',
                                    private: false,
                                    teamId: team.id,
                                },
                                { transaction },
                            );

                            // create a team admin entry
                            await models.TeamMember.create(
                                {
                                    teamId: team.id,
                                    userId: user.id,
                                    admin: true,
                                },
                                { transaction },
                            );
                            return team;
                        });

                    return {
                        ok: true,
                        team: res,
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
                        const team = await models.Team.findOne({
                            where: { id: teamId }, raw: true,
                        });
                        const token = createInviteToken({ teamId, email });
                        await emailTransporter.sendMail({
                            from: 'swoy-inviteservice@gmail.com',
                            to: email,
                            subject: `Invitation to team ${team.name}`,
                            html: `
                            <div>
                            <h1><i>Hello</i> from SWOY corporate messenger</h1>
                            <h2>You have received invitation to the team ${team.name}.</h2>
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
                            status: 'Ivitation was send',
                        };
                    }

                    // check if user is already the team member
                    const isMember = await models.sequelize
                        .query(
                            `select * from team_members as tm
                            join users as u on u.id = tm.user_id
                            where u.email = ? limit 1`,
                            {
                                replacements: [email],
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
            async (_, { teamId, option, value }, { models }) => {
                try {
                    // TODO: update the team
                    const updatedTeam = await models.sequelise
                        .query(
                            `update teams
                            set :option = :value
                            where id = :teamId
                            `,
                            {
                                replacements: { option, value, teamId },
                                model: models.Team,
                                raw: true,
                            },
                        );

                    return {
                        ok: true,
                        team: updatedTeam,
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
                    // TODO: delete the team
                    await models.Teams.destroy({ where: { id: teamId } });

                    return true;
                } catch (err) {
                    return false;
                }
            },
        ),
    },
};
