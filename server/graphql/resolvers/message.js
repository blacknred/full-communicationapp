import { PubSub, withFilter } from 'graphql-subscriptions';

import { requiresAuth, requiresTeamAccess } from '../../permissions';

const pubsub = new PubSub();

const NEW_CHANNEL_MESSAGE = 'NEW_CHANNEL_MESSAGE';

export default {
    Subscription: {
        newChannelMessage: {
            // resolve: (payload, args, context, info) => {
            //     // Manipulate and return the new value
            //     console.log('new payload', payload);
            //     return payload.newChannelMessage;
            // },
            subscribe: requiresTeamAccess.createResolver(
                withFilter(
                    () => pubsub.asyncIterator(NEW_CHANNEL_MESSAGE),
                    // (payload, args) => payload.newChannelMessage.channelId === args.channelId,
                    (payload, args) => payload.channelId === args.channelId,
                ),
            ),
        },
    },
    Message: {
        user: ({ user, userId }, args, { models }) => {
            if (user) return user;
            return models.User.findOne(
                { where: { id: userId } },
                { raw: true },
            );
        },
    },
    Query: {
        messages: requiresAuth.createResolver(
            async (parent, { channelId }, { models }) => models
                .Message.findAll(
                    {
                        order: [['created_at', 'ASC']],
                        where: { channelId },
                    },
                    { raw: true },
                ),
        ),
    },
    Mutation: {
        createChannelMessage: requiresAuth.createResolver(
            async (parent, args, { models, user }) => {
                try {
                    const message = await models.Message.create({
                        ...args,
                        userId: user.id,
                    });

                    const asyncFunc = async () => {
                        const currentUser = await models.User.findOne({
                            where: { id: user.id },
                        });
                        pubsub.publish(NEW_CHANNEL_MESSAGE, {
                            channelId: args.channelId,
                            newChannelMessage: {
                                ...message.dataValues,
                                user: currentUser.dataValues,
                            },
                        });
                    };

                    asyncFunc();

                    return true;
                } catch (err) {
                    return false;
                }
            },
        ),
    },
};
