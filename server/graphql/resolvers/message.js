import { withFilter } from 'graphql-subscriptions';

import pubsub from '../../pubsub';
import { requiresAuth, requiresTeamAccess } from '../../permissions';

const CHANNEL_MESSAGE_CREATED = 'CHANNEL_MESSAGE_CREATED';
const CHANNEL_MESSAGE_UPDATED = 'CHANNEL_MESSAGE_UPDATED';
const CHANNEL_MESSAGE_REMOVED = 'CHANNEL_MESSAGE_REMOVED';

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
                { where: { messageId: id } },
                { raw: true },
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
    Query: {
        getMessages: requiresAuth.createResolver(
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
            async (parent, { files, ...restArgs }, { models, user }) => {
                try {
                    // check if user has access to channel
                    const channel = await models.Channel.findOne(
                        { where: { id: restArgs.channelId } },
                        { raw: true },
                    );
                    if (channel.private) {
                        const isPrivateChannelMember = await models.PrivateChannelMember
                            .findOne(
                                { where: { channelId: channel.id, userId: user.id } },
                                { raw: true },
                            );
                        if (!isPrivateChannelMember) return false;
                    } else {
                        const isTeamMember = await models.TeamMember
                            .findOne(
                                { where: { teamId: channel.teamId, userId: user.id } },
                                { raw: true },
                            );
                        if (!isTeamMember) return false;
                    }

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
                            where: { id: user.id },
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
        updateMessage: requiresAuth.createResolver(
            async (parent, { messageId, newText, newFiles }, { models, user }) => {
                try {
                    // check if the message exists and user is a sender
                    const message = await models.Message.findOne({
                        where: { id: messageId, userId: user.id },
                        raw: true,
                    });
                    if (!message) return false;

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
        deleteMessage: requiresAuth.createResolver(
            async (parent, { messageId, adminAccess }, { models, user }) => {
                try {
                    const pubsubFunc = () => {
                        // TODO: remove message from pubsub
                        // pubsub.publish(CHANNEL_MESSAGE_REMOVED, {
                        //     messageId,
                        //     channelMessagesUpdated: {
                        //         ...message.dataValues,
                        //         user: currentUser.dataValues,
                        //     },
                        // });
                    };

                    // if user is a admin of team that host the
                    // message he could remove it directly
                    if (adminAccess) {
                        const isTeamAdmin = await models.sequelize.query(
                            `select user_id from team_members as tm
                            left outer join teams as t on t.id = tm.team_id
                            left outer join channels as c on c.team_id = t.id
                            left outer join messages as m on m.channel_id = c.id
                            where m.id = :messageId
                            and tm.admin = true`,
                            {
                                replacements: { messageId },
                                model: models.TeamMember,
                                raw: true,
                            },
                        );
                        if (isTeamAdmin) {
                            await models.Message.destroy({
                                where: { id: messageId },
                            });
                            pubsubFunc();
                            return true;
                        }
                        return false;
                    }

                    // delete the message by author access
                    await models.Message.destroy({
                        where: { id: messageId, user_id: user.id },
                    });
                    pubsubFunc();

                    return true;
                } catch (err) {
                    return false;
                }
            },
        ),
    },
};
