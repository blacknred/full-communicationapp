import formateErrors from '../../formateErrors';
import { requiresTeamAccess, requiresTeamAdminAccess } from '../../permissions';

export default {
    Channel: {
        participants: ({ id, private: isPrivate }, _, { loaders }) => (
            loaders.participant.load({ id, isPrivate })
        ),
        participantsCount: ({ id, private: isPrivate }, _, { loaders }) => (
            loaders.participantsCount.load({ id, isPrivate })
        ),
        filesCount: ({ id }, _, { loaders }) => loaders.channelFilesCount.load(id),
        messagesCount: ({ id }, _, { loaders }) => loaders.channelMessagesCount.load(id),
        updatesCount: ({ id }, _, { loaders }) => loaders.channelUpdatesCount.load(id),
    },
    Query: {
        getChannel: requiresTeamAccess.createResolver(
            (_, { channelId }, { models }) => models.Channel.findByPk(channelId),
        ),
    },
    Mutation: {
        createChannel: requiresTeamAdminAccess.createResolver(
            async (_, args, { models, user }) => {
                try {
                    // check if name is not reserved 'general'
                    if (args.name.toLowerCase() === 'general') {
                        return {
                            ok: false,
                            errors: [{
                                path: 'name',
                                message: 'The name "general" is reserved',
                            }],
                        };
                    }

                    // in case of private channel check members
                    if (args.private && args.members.length === 0) {
                        return {
                            ok: false,
                            errors: [{
                                path: 'private',
                                message: `The private channel must
                                have a team members`,
                            }],
                        };
                    }

                    const channel = await models.sequelize
                        .transaction(async (transaction) => {
                            // create a common non dm channel
                            const newChannel = await models.Channel.create(
                                args, { transaction },
                            );

                            // in case of private channel set allowed members
                            if (args.private) {
                                const allMembers = [...new Set([...args.members, user.id])];
                                await models.PrivateChannelMember.bulkCreate(
                                    allMembers.map(userId => ({
                                        user_id: userId,
                                        channelId: newChannel.dataValues.id,
                                    })),
                                    { transaction },
                                );
                            }
                            return newChannel;
                        });

                    // create announcement message in channel
                    await models.Message.create({
                        text: 'Channel has been created!',
                        userId: user.id,
                        announcement: true,
                        channelId: channel.dataValues.id,
                    });

                    return {
                        ok: true,
                        channel: {
                            ...channel.dataValues,
                            starred: false,
                        },
                    };
                } catch (err) {
                    return {
                        ok: false,
                        errors: formateErrors(err, models),
                    };
                }
            },
        ),
        updateChannel: requiresTeamAdminAccess.createResolver(
            async (_, { channelId, members, ...args }, { models, user }) => {
                try {
                    // check if channel is not direct messages chat
                    const channel = await models.Channel.findByPk(channelId);
                    if (channel.dm) {
                        return {
                            ok: false,
                            errors: [{
                                path: 'name',
                                message: 'The dm channel is not updatable',
                            }],
                        };
                    }

                    // check if name is not reserved 'general'
                    if (args.name.toLowerCase() === 'general') {
                        return {
                            ok: false,
                            errors: [{
                                path: 'name',
                                message: 'The name "general" is reserved',
                            }],
                        };
                    }

                    // in case of private channel check members
                    if (args.private && members.length === 0) {
                        return {
                            ok: false,
                            errors: [{
                                path: 'name',
                                message: `The private channel must
                                have a team members`,
                            }],
                        };
                    }

                    const updatedChannel = await models.sequelize
                        .transaction(async (transaction) => {
                            // update a common non dm channel
                            const [, updatedRows] = await models.Channel.update(
                                args,
                                {
                                    where: { id: channelId },
                                    returning: true,
                                    transaction,
                                },
                            );

                            // manage allowed members in case of private status
                            if (args.private) {
                                // the difference in the number of participants will find that
                                // the number of members has been changed
                                // the channel has been switched to private
                                if (!members.includes(user.id)) {
                                    members.push(user.id);
                                }
                                let exMembers = await models.PrivateChannelMember.findAll(
                                    { where: { channelId } },
                                    { raw: true },
                                );
                                exMembers = exMembers.map(m => m.user_id);

                                const allMembers = [...new Set([...exMembers, ...members])];
                                const toDelete = allMembers.filter(m => !members.includes(m));
                                const toCreate = allMembers.filter(m => !exMembers.includes(m));

                                console.log(allMembers, toDelete, toCreate);
                                // delete members
                                await models.PrivateChannelMember.destroy(
                                    { where: { user_id: toDelete } },
                                    { transaction },
                                );
                                // create members
                                await models.PrivateChannelMember.bulkCreate(
                                    toCreate.map(m => ({
                                        user_id: m,
                                        channelId,
                                    })),
                                    { transaction },
                                );
                            } else {
                                // otherwise delete all existing members
                                await models.PrivateChannelMember.destroy(
                                    { where: { channelId } },
                                    { transaction },
                                );
                            }

                            return updatedRows[0];
                        });

                    // create announcement message in channel
                    let updateMessage = 'Channel has been updated';
                    if (channel.private !== args.private) {
                        if (args.private) {
                            updateMessage = `Access restricted to ${members.length} members`;
                        } else {
                            updateMessage = 'Channel has been switched to public access';
                        }
                    }
                    await models.Message.create({
                        text: updateMessage,
                        userId: user.id,
                        announcement: true,
                        channelId,
                    });

                    return {
                        ok: true,
                        channel: updatedChannel,
                    };
                } catch (err) {
                    return {
                        ok: false,
                        errors: formateErrors(err, models),
                    };
                }
            },
        ),
        deleteChannel: requiresTeamAdminAccess.createResolver(
            async (_, { channelId }, { models }) => {
                try {
                    await models.Channel.destroy(
                        { where: { id: channelId } },
                    );

                    return true;
                } catch (err) {
                    return false;
                }
            },
        ),
        createDMChannel: requiresTeamAccess.createResolver(
            async (_, { teamId, members }, { models, user }) => {
                try {
                    // if dm channel with provided members already exists return it
                    const allMembers = [...new Set([...members, user.id])];
                    const existedChannel = await models.sequelize.query(
                        `select c.id, c.name from channels as c,
                        private_channel_members pc 
                        where pc.channel_id = c.id
                        and c.dm = true
                        and c.private = true
                        and c.team_id = :teamId
                        group by c.id, c.name 
                        having array_agg(pc.user_id) @> Array[${allMembers.join(',')}]
                        and count(pc.user_id) = :length;
                        `,
                        {
                            replacements: {
                                teamId,
                                length: allMembers.length,
                            },
                            model: models.Channel,
                            raw: true,
                        },
                    );
                    if (existedChannel.length) {
                        return models.Channel.findOne({
                            where: { id: existedChannel[0].id },
                            raw: true,
                        });
                    }

                    // otherwise create a new dm channel with a specific name
                    const users = await models.User.findAll({
                        where: { id: { [models.sequelize.Op.in]: members } },
                        raw: true,
                    });
                    const name = users.map(u => u.username).join(', ');
                    const channel = await models.sequelize
                        .transaction(async (transaction) => {
                            // create channel
                            const newChannel = await models.Channel.create(
                                {
                                    teamId,
                                    name,
                                    private: true,
                                    dm: true,
                                },
                                { transaction },
                            );

                            // manage members
                            await models.PrivateChannelMember.bulkCreate(
                                allMembers.map(m => ({
                                    channelId: newChannel.dataValues.id,
                                    user_id: m,
                                })),
                                { transaction },
                            );

                            return newChannel;
                        });

                    // create announcement message in channel
                    await models.Message.create({
                        text: 'Chat has been created!',
                        userId: user.id,
                        announcement: true,
                        channelId: channel.dataValues.id,
                    });

                    return {
                        ...channel.dataValues,
                        starred: false,
                    };
                } catch (err) {
                    return {
                        ok: false,
                        errors: formateErrors(err, models),
                    };
                }
            },
        ),
        starChannel: requiresTeamAccess.createResolver(
            async (_, { channelId }, { models, user }) => {
                try {
                    // add new row on starred_channels
                    await models.StarredChannel.create({
                        channelId, userId: user.id,
                    });
                    return true;
                } catch (err) {
                    return false;
                }
            },
        ),
        unstarChannel: requiresTeamAccess.createResolver(
            async (_, { channelId }, { models, user }) => {
                try {
                    // remove row from starred_channels
                    await models.StarredChannel.destroy({
                        where: { channelId, userId: user.id },
                    });
                    return true;
                } catch (err) {
                    return false;
                }
            },
        ),

    },
};
