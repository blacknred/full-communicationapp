import { withFilter } from 'graphql-subscriptions';

import pubsub from '../../pubsub';
import { requiresAuth, requiresTeamAccess } from '../../permissions';

const NEW_CHANNEL_MESSAGE = 'NEW_CHANNEL_MESSAGE';

export default {
    Message: {
        sender: ({ user, userId }, args, { models }) => {
            if (user) return user;
            return models.User.findOne(
                { where: { id: userId } },
                { raw: true },
            );
        },
        files: ({ id }, args, { models }) => models.File
            .findAll(
                { where: { message_id: id } },
                { raw: true },
            ),
    },
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
    Query: {
        messages: requiresAuth.createResolver(
            async (parent, { channelId }, { models, user }) => {
                // check if related channel is private
                // if so, check user access right
                const channel = await models.Channel.findOne({
                    raw: true,
                    where: { id: channelId },
                });
                if (channel.private) {
                    const member = await models.PrivateChannelMember.findOne({
                        raw: true,
                        where: { channelId, userId: user.id },
                    });
                    if (!member) throw new Error('Not Authorized');
                }

                // get channel related messages
                return models.Message.findAll(
                    {
                        order: [['created_at', 'ASC']],
                        where: { channelId },
                    },
                    { raw: true },
                );
            },
        ),
    },
    Mutation: {
        createMessage: requiresAuth.createResolver(
            async (parent, { files, ...args }, { models, user }) => {
                try {
                    const message = await models.sequelize
                        .transaction(async (transaction) => {
                            // create a new message
                            const newMessage = await models.Message.create(
                                {
                                    ...args,
                                    userId: user.id,
                                },
                                { transaction },
                            );

                            // create entries for related files if needed
                            const newFiles = [];
                            files.forEach(async (file) => {
                                const newFile = await models.File.create(
                                    {
                                        ...file,
                                        messageId: newMessage.id,
                                    },
                                    { transaction },
                                );
                                newFiles.push(newFile);
                            });

                            return { newMessage, files: newFiles };
                        });

                    // put new message in subscription pubsub
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
