import bcrypt from 'bcryptjs';

import redisClient from '../../redis';
import formateErrors from '../../formateErrors';
import { requiresAuth } from '../../permissions';
import { createTokens, SECRET2, checkInviteToken } from '../../auth';

export default {
    User: {
        online: async ({ id }) => !!await redisClient.getAsync(`user_${id}_online`),
    },
    Query: {
        getCurrentUser: requiresAuth.createResolver(
            (_, __, { models, user }) => models.User.findOne({
                where: { id: user.id }, raw: true,
            }),
        ),
    },
    Mutation: {
        register: async (_, { teamToken, ...args }, { models }) => {
            try {
                // create user
                const user = await models.User.create(args);

                // if there is team invite token, create new member
                if (teamToken) {
                    const { teamId, email } = checkInviteToken(teamToken);
                    if (teamId && email === args.email) {
                        await models.TeamMember.create({
                            userId: user.id,
                            teamId,
                        });
                    }
                }
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
        login: async (_, { email, password, teamToken }, { models }) => {
            try {
                // is user exists
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

                // if there is team invite token, create new member
                if (teamToken) {
                    const { teamId, email: tokenEmail } = checkInviteToken(teamToken);
                    if (teamId && tokenEmail === email) {
                        await models.TeamMember.create({
                            userId: user.id,
                            teamId,
                        });
                    }
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
            async (_, { option, value }, { models, user }) => {
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
            async (_, __, { models, user }) => {
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
