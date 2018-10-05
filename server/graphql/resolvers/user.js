import redisClient from '../../redis';
import { tryLogin } from '../../auth';
import formateErrors from '../../formateErrors';
import { requiresAuth } from '../../permissions';

export default {
    User: {
        online: async ({ id }) => !!await redisClient.getAsync(`${id}_user_online`),
        teams: (parent, args, { models, user }) => models
            .sequelize.query(
                `select * from teams as t
                    join members as m on t.id = m.team_id
                    where m.user_id = ?`,
                {
                    replacements: [user.id],
                    model: models.Team,
                    raw: true,
                },
            ),
    },
    Query: {
        me: requiresAuth.createResolver(
            (parent, args, { models, user }) => models
                .User.findOne({ where: { id: user.id } }),
        ),
        allUsers: (parent, args, { models }) => models.User.findAll(),
        getUser: (parent, { userId }, { models }) => models
            .User.findOne({ where: { id: userId } }),
    },
    Mutation: {
        login: (parent, { email, password }, { models }) => tryLogin({
            email, password, models,
        }),
        register: async (parent, args, { models }) => {
            try {
                const user = await models.User.create(args);
                return {
                    ok: true,
                    user,
                };
            } catch (err) {
                return {
                    ok: false,
                    errors: formateErrors(err, models),
                };
            }
        },
    },
};
