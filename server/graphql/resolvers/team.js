import formateErrors from '../../formateErrors';
import { requiresAuth } from '../../permissions';

export default {
    Team: {
        admin: ({ id }, args, { models }) => models.sequelize
            .query(
                `select u.id, u.username from users as u
                join team_members as tm on u.id = tm.user_id
                where tm.team_id = ? and tm.admin = true`,
                {
                    replacements: [id],
                    model: models.User,
                    raw: true,
                },
            ).then(users => users[0]), // TODO:
        channels: ({ id }, args, { models, user }) => models.sequelize
            .query(
                `select distinct on (id) * from channels as c 
                left outer join private_channel_members as pc on c.id = pc.channel_id
                where c.team_id = :teamId
                and (c.private = true or pc.user_id = :userId);`,
                {
                    replacements: { teamId: id, userId: user.id },
                    model: models.Channel,
                    raw: true,
                },
            ),
        directMessageMembers: ({ id }, args, { models, user }) => models.sequelize
            .query(
                `select distinct on (u.id) u.id, u.username from users as u
                join direct_messages as dm on (u.id = dm.sender_id) or (u.id = dm.receiver_id)
                where (:currentUserId = dm.sender_id or :currentUserId = dm.receiver_id)
                and dm.team_id = :teamId`,
                {
                    replacements: { currentUserId: user.id, teamId: id },
                    model: models.User,
                    raw: true,
                },
            ),
    },
    Query: {
        teamMembers: requiresAuth.createResolver(
            (parent, { teamId }, { models }) => models
                .sequelize.query(
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
            async (parent, args, { models, user }) => {
                try {
                    const res = await models.sequelize
                        .transaction(async (transaction) => {
                            // create a new team
                            const team = await models.Team.create(
                                { ...args },
                                { transaction },
                            );

                            // create a  'general' public channel
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
        addTeamMember: requiresAuth.createResolver(
            async (parent, { email, teamId }, { models, user }) => {
                try {
                    // check if user has admin rights
                    // and new member is a valid user
                    const [member, userToAdd] = await Promise.all([
                        models.TeamMember.findOne(
                            { where: { teamId, userId: user.id } },
                            { raw: true },
                        ),
                        models.User.findOne(
                            { where: { email } },
                            { raw: true },
                        ),
                    ]);
                    if (!member.admin) {
                        return {
                            ok: false,
                            errors: [{
                                path: 'email',
                                message: 'The operation needs team admin rights',
                            }],
                        };
                    }
                    if (!userToAdd) {
                        return {
                            ok: false,
                            errors: [{
                                path: 'email',
                                message: 'The email is not in use',
                            }],
                        };
                    }

                    // create a entry for new team member
                    await models.TeamMember.create({
                        userId: userToAdd.id,
                        teamId,
                    });

                    return { ok: true };
                } catch (err) {
                    return {
                        ok: false,
                        errors: formateErrors(err, models),
                    };
                }
            },
        ),
    },
};
