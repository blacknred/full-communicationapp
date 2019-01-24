import redisClient from '../../redis';
import formateErrors from '../../formateErrors';
import { requiresTeamAccess, requiresTeamAdminAccess } from '../../permissions';

export default {
    Channel: {
        updatesCount: async ({ id }, _, { models, user }) => {
            const lastVisit = await redisClient.getAsync(`user_${user.id}_online`);
            const [{ count }] = await models.sequelize.query(
                `select count(*) from messages as m
                join channels as c on m.channel_id = c.id
                where c.id = :channelId and m.created_at > to_timestamp(:lastVisit)`,
                {
                    replacements: { channelId: id, lastVisit },
                    model: models.Message,
                    raw: true,
                },
            );
            return count;
        },
        membersCount: ({ id, private: isPrivate }, _, { models }) => {
            // in case of private channel get restricted users count
            if (isPrivate) {
                return models.PrivateChannelMember.count({
                    where: { channelId: id },
                });
            }
            // otherway get count of users have allready posted in channel
            return models.Message.aggregate('user_id', 'count', {
                where: { channelId: id },
                distinct: true,
            });
        },
        messagesCount: ({ id }, _, { models }) => models.Message
            .count({
                where: { channelId: id },
                distinct: true,
            }),
        filesCount: ({ id }, _, { models }) => models.sequelize
            .query(
                `select count(*) from files as f
                join messages as m on f.message_id = m.id
                join channels as c on m.channel_id = c.id
                where c.id = :channelId`,
                {
                    replacements: { channelId: id },
                    model: models.Files,
                    raw: true,
                },
            ),
    },
    Query: {
        getChannelInfo: requiresTeamAccess.createResolver(
            async (_, { channelId }, { models }) => {
                // in case of private channel get restricted users
                const { private: isPrivate } = await models.Channel.findById(channelId);
                if (isPrivate) {
                    return models.sequelize.query(
                        `select distinct on (u.id) u.* from users as u
                        join private_channel_members as pcm on pcm.user_id = u.id
                        where pcm.channel_id = ?`,
                        {
                            replacements: [channelId],
                            model: models.User,
                            raw: true,
                        },
                    );
                }

                // in otherway get users that have allready posted messages in channel
                return models.sequelize.query(
                    `select distinct on (u.id) u.* from users as u
                    join messages as m on m.user_id = u.id
                    where m.channel_id = ?`,
                    {
                        replacements: [channelId],
                        model: models.User,
                        raw: true,
                    },
                );
            },
        ),
        getChannelMembers: requiresTeamAccess.createResolver(
            async (_, { channelId }, { models }) => {
                // in case of private channel get restricted users
                const { private: isPrivate } = await models.Channel.findById(channelId);
                if (isPrivate) {
                    return models.sequelize.query(
                        `select distinct on (u.id) u.* from users as u
                        join private_channel_members as pcm on pcm.user_id = u.id
                        where pcm.channel_id = ?`,
                        {
                            replacements: [channelId],
                            model: models.User,
                            raw: true,
                        },
                    );
                }

                // in otherway get users that have allready posted messages in channel
                return models.sequelize.query(
                    `select distinct on (u.id) u.* from users as u
                    join messages as m on m.user_id = u.id
                    where m.channel_id = ?`,
                    {
                        replacements: [channelId],
                        model: models.User,
                        raw: true,
                    },
                );
            },
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

                    // create a common non dm channel
                    // in case of private channel set allowed members
                    const channel = await models.sequelize
                        .transaction(async (transaction) => {
                            const newChannel = await models.Channel.create(
                                args, { transaction },
                            );
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
                        text: 'Channel was created!',
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
                    // check if channel is not dm
                    const channel = await models.Channel.findById(channelId);
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
                                    transaction,
                                    returning: true,
                                },
                            );

                            // manage allowed members if channel is switched to private
                            if (args.private) {
                                const membersToDelete = [];
                                const membersToCreate = [];
                                members.push(user.id);
                                const exMembers = await models.PrivateChannelMember.findAll(
                                    { where: { channelId } },
                                    { raw: true },
                                );
                                const exMemberIds = exMembers.map(m => m.user_id);
                                const allMembers = [...new Set([...exMemberIds, ...members])];
                                // const diffMembers = exMembers.filter(x => !members.includes(x));
                                await allMembers.forEach((m) => {
                                    if (!members.includes(m)) membersToDelete.push(m);
                                    if (!exMembers.includes(m)) {
                                        membersToCreate.push({
                                            user_id: m,
                                            channelId,
                                        });
                                    }
                                });
                                console.log(membersToDelete, membersToCreate);
                                // delete members
                                await models.PrivateChannelMember.destroy(
                                    { where: { user_id: membersToDelete } },
                                    { transaction },
                                );
                                // create members
                                await models.PrivateChannelMember.bulkCreate(
                                    membersToCreate,
                                    { transaction },
                                );
                            } else {
                                // in otherway delete all members if were
                                await models.PrivateChannelMember.destroy(
                                    { where: { channelId } },
                                    { transaction },
                                );
                            }
                            return updatedRows[0];
                        });

                    // create announcement message in channel
                    let updateMessage = 'Channel was updated';
                    if (channel.private !== args.private) {
                        if (args.private) {
                            updateMessage = `Access restricted to ${members.length + 1} members`;
                        } else {
                            updateMessage = 'Channel was switched to public access ';
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

                    // in otherway create a new dm channel with a composite name
                    const users = await models.User.findAll({
                        where: { id: { [models.sequelize.Op.in]: members } },
                        raw: true,
                    });
                    const name = users.map(u => u.username).join(', ');
                    const channel = await models.sequelize
                        .transaction(async (transaction) => {
                            const newChannel = await models.Channel.create(
                                {
                                    teamId,
                                    name,
                                    private: true,
                                    dm: true,
                                },
                                { transaction },
                            );
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
                        text: 'Chat was created!',
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
