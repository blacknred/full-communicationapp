import bcrypt from 'bcryptjs';

import redisClient from '../../redis';
import formateErrors from '../../formateErrors';
import { requiresAuth } from '../../permissions';
import { createTokens, SECRET2 } from '../../auth';

export default {
    User: {
        online: async ({ id }) => !!await redisClient.getAsync(`user_${id}_online`),
    },
    Query: {
        getCurrentUser: requiresAuth.createResolver(
            (parent, args, { models, user }) => models.User.findOne({
                where: { id: user.id }, raw: true,
            }),
        ),
    },
    Mutation: {
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
        login: async (parent, { email, password }, { models }) => {
            try {
                // is user exist
                const user = await models.User.findOne({
                    where: { email }, raw: true,
                });
                if (!user) {
                    return {
                        ok: false,
                        errors: [
                            {
                                path: 'email',
                                message: 'Email not in use',
                            },
                        ],
                    };
                }

                // is password valid
                const isPasswordValid = await bcrypt.compare(password, user.password);
                if (!isPasswordValid) {
                    return {
                        ok: false,
                        errors: [
                            {
                                path: 'password',
                                message: 'Wrong password',
                            },
                        ],
                    };
                }

                // create token
                const refreshTokenSecret = user.password + SECRET2;
                const [token, refreshToken] = await createTokens({
                    user, refreshTokenSecret,
                });
                return {
                    ok: true,
                    token,
                    refreshToken,
                };
            } catch (err) {
                return {
                    ok: false,
                    errors: formateErrors(err, models),
                };
            }
        },
        updateUser: requiresAuth.createResolver(
            async (parent, { option, value }, { models, user }) => {
                try {
                    // TODO: update user
                    const updatedUser = await models.sequelise
                        .query(
                            `update users
                            set :option = :value
                            where id = :userId
                            `,
                            {
                                replacements: { option, value, userId: user.id },
                                model: models.User,
                                raw: true,
                            },
                        );
                    return {
                        ok: true,
                        user: updatedUser,
                    };
                } catch (err) {
                    return {
                        ok: false,
                        errors: formateErrors(err, models),
                    };
                }
            },
        ),
        deleteUser: requiresAuth.createResolver(
            async (parent, args, { models, user }) => {
                try {
                    // TODO: delete user
                    await models.User.destroy({ where: { id: user.id } });
                    return true;
                } catch (err) {
                    return false;
                }
            },
        ),
    },
};
