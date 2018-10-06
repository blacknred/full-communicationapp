import formateErrors from '../../formateErrors';
import { requiresAuth } from '../../permissions';

export default {
    Query: {
        teamMembers: requiresAuth.createResolver(
            (parent, { teamId }, { models }) => models
                .sequelize.query(
                    `select * from users as u
                    join members as m on m.user_id = u.id
                    where m.team_id = ?`,
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
                    const res = await models.sequelize.transaction(async (transaction) => {
                        const team = await models.Team.create({ ...args }, { transaction });
                        await models.Channel.create(
                            {
                                name: 'general',
                                public: true,
                                teamId: team.id,
                            },
                            { transaction },
                        );
                        await models.Member.create(
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
                    const [member, userToAdd] = await Promise.all([
                        models.Member.findOne(
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
                                message: 'You cannot add members to the team',
                            }],
                        };
                    }
                    if (!userToAdd) {
                        return {
                            ok: false,
                            errors: [{
                                path: 'email',
                                message: 'Could not find user with this email',
                            }],
                        };
                    }
                    await models.Member.create({
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
    Team: {
        admin: ({ id }, args, { models }) => models.sequelize.query(
            `select u.id, u.username from users as u
            join members as m on u.id = m.user_id
            where m.team_id = ? and m.admin = true`,
            {
                replacements: [id],
                model: models.User,
                raw: true,
            },
        ).then(users => users[0]),
        channels: ({ id }, args, { models }) => models
            .Channel.findAll({ where: { teamId: id } }),
        directMessageMembers: ({ id }, args, { models, user }) => models.sequelize.query(
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
    },
};
