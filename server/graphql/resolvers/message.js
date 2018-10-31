import { withFilter } from 'graphql-subscriptions';

import pubsub from '../../pubsub';
import {
    requiresTeamAccess,
    requiresPrivateChannelAccess,
    requiresMessageFullAccess,
} from '../../permissions';

const CHANNEL_MESSAGE_CREATED = 'CHANNEL_MESSAGE_CREATED';
const CHANNEL_MESSAGE_UPDATED = 'CHANNEL_MESSAGE_UPDATED';
const CHANNEL_MESSAGE_REMOVED = 'CHANNEL_MESSAGE_REMOVED';

export default {
    Message: {
        sender: ({ user, userId }, args, { models }) => {
            if (user) return user;
            return models.User.findOne({
                where: { id: userId }, raw: true,
            });
        },
        files: ({ id }, args, { models }) => models.File.findAll(
            { where: { messageId: id } },
            { raw: true },
        ),
    },
    Query: {
        getMessages: requiresTeamAccess.createResolver(
            requiresPrivateChannelAccess.createResolver(
                async (parent, { channelId }, { models }) => models.Message
                    .findAll(
                        {
                            order: [['created_at', 'ASC']],
                            where: { channelId },
                        },
                        { raw: true },
                    ),
            ),
        ),
    },
    Mutation: {
        createMessage: requiresTeamAccess.createResolver(
            requiresPrivateChannelAccess.createResolver(
                async (_, { files, ...restArgs }, { models, user }) => {
                    try {
                        // create a new message
                        // create entries for related files if needed
                        const message = await models.sequelize
                            .transaction(async (transaction) => {
                                const newMessage = await models.Message.create(
                                    {
                                        ...restArgs,
                                        userId: user.id,
                                    },
                                    { transaction },
                                );
                                const filesMap = files.map(file => ({
                                    ...file, messageId: newMessage.id,
                                }));
                                await models.File.bulkCreate(filesMap, { transaction });

                                return newMessage;
                            });

                        // put new message in pubsub
                        const asyncFunc = async () => {
                            const currentUser = await models.User.findOne({
                                where: { id: user.id }, raw: true,
                            });
                            pubsub.publish(CHANNEL_MESSAGE_CREATED, {
                                channelId: restArgs.channelId,
                                channelMessagesUpdated: {
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
        ),
        updateMessage: requiresMessageFullAccess.createResolver(
            async (_, { messageId, newText, newFiles }, { models }) => {
                try {
                    // update the text if provided
                    if (newText) {
                        await models.Message.update(
                            { text: newText },
                            { where: { id: messageId } },
                        );
                    }

                    // add the files if provided
                    if (newFiles) {
                        const filesMap = newFiles.map(file => ({
                            ...file, messageId,
                        }));
                        await models.File.bulkCreate(filesMap);
                    }

                    // TODO: update message in pubsub
                    // pubsub.publish(CHANNEL_MESSAGE_UPDATED, {
                    //     messageId,
                    //     channelMessagesUpdated: {
                    //         ...message.dataValues,
                    //         user: currentUser.dataValues,
                    //     },
                    // });

                    return true;
                } catch (err) {
                    return false;
                }
            },
        ),
        deleteMessage: requiresMessageFullAccess.createResolver(
            async (_, { messageId }, { models, user }) => {
                try {
                    // delete the message
                    await models.Message.destroy({
                        where: { id: messageId, user_id: user.id },
                    });

                    const pubsubFunc = () => {
                        // TODO: remove message from pubsub
                        // pubsub.publish(CHANNEL_MESSAGE_REMOVED, {
                        //     messageId,
                        //     channelMessagesUpdated: {
                        //         messageId,
                        //     },
                        // });
                    };
                    pubsubFunc();

                    return true;
                } catch (err) {
                    return false;
                }
            },
        ),
    },
    Subscription: {
        channelMessagesUpdated: {
            resolve: (payload, args, context, info) => {
                // Manipulate and return the new value
                console.log('new payload', payload, args, context, info);
                return payload.channelMessagesUpdated;
            },
            subscribe: requiresTeamAccess.createResolver(
                withFilter(
                    () => pubsub.asyncIterator(
                        CHANNEL_MESSAGE_CREATED,
                        CHANNEL_MESSAGE_UPDATED,
                        CHANNEL_MESSAGE_REMOVED,
                    ),
                    // (payload, args) => payload.newChannelMessage.channelId === args.channelId,
                    (payload, args) => payload.channelId === args.channelId,
                ),
            ),
        },
    },
};
