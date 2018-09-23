import formateErrors from '../../formateErrors';
import { requiresAuth } from '../../permissions';

export default {
    Mutation: {
        createTeam: requiresAuth.createResolver(
            async (parent, args, { models, user }) => {
                try {
                    const res = await models.sequelize.transaction(async () => {
                        const team = await models.Team.create({ ...args });
                        await models.Channel.create({
                            name: 'general',
                            public: true,
                            teamId: team.id,
                        });
                        await models.Member.create({
                            teamId: team.id,
                            userId: user.id,
                            admin: true,
                        });
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
        channels: ({ id }, args, { models }) => models
            .Channel.findAll({ where: { teamId: id } }),
    },
};
