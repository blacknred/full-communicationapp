import formateErrors from '../../formateErrors';
import { requiresAuth } from '../../permissions';

export default {
    Query: {
        allTeams: requiresAuth.createResolver(
            async (parent, args, { models, user }) => models
                .Team.findAll(
                    { where: { owner: user.id } },
                    { raw: true },
                ),
        ),
        inviteTeams: requiresAuth.createResolver(
            async (parent, args, { models, user }) => models
                .Team.findAll(
                    {
                        include: [{
                            model: models.User,
                            where: { id: user.id },
                        }],
                    },
                    { raw: true },
                ),
        ),
    },
    Mutation: {
        createTeam: requiresAuth.createResolver(
            async (parent, args, { models, user }) => {
                try {
                    const res = await models.sequelize.transaction(async () => {
                        const team = await models.Team.create({
                            ...args,
                            owner: user.id,
                        });
                        await models.Channel.create({
                            name: 'general',
                            public: true,
                            teamId: team.id,
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
                    const [team, userToAdd] = await Promise.all([
                        models.Team.findOne(
                            { where: { id: teamId } },
                            { raw: true },
                        ),
                        models.User.findOne(
                            { where: { email } },
                            { raw: true },
                        ),
                    ]);
                    if (user.id !== team.owner) {
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
