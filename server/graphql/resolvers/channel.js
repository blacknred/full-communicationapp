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
        participantsCount: async ({ id, private: isPrivate }, _, { models }) => {
            // in case of private channel get restricted users count
            if (isPrivate) {
                return models.PrivateChannelMember.count({
                    where: { id },
                });
            }
            // otherway get count of users have allready posted in channel
            return models.Message.aggregate('user_id', 'count', {
                where: { channelId: id },
                distinct: true,
            });
            // return models.Message.count({
            //     where: { channelId: id },
            //     distinct: true,
            //     col: 'user_id',
            //     // group: {}
            // });
        },
    },
    Mutation: {
        getOrCreateChannel: requiresTeamAccess.createResolver(
            async (_, { teamId, members }, { models, user }) => {
                try {
                    // check if dm channel already exists with these members
                    // return if does
                    const allMembers = [...members, user.id];
                    const [data, result] = await models.sequelize.query(
                        `select c.id, c.name
                        from channels as c, private_channel_members pc 
                        where pc.channel_id = c.id
                        and c.dm = true
                        and c.private = true
                        and c.team_id = ${teamId}
                        group by c.id, c.name 
                        having array_agg(pc.user_id) @> Array[${allMembers.join(',')}]
                        and count(pc.user_id) = ${allMembers.length};
                        `,
                        { raw: true },
                    );
                    console.log(data, result);
                    if (data.length) return data[0];

                    // otherway create a new dm channel with a composite name
                    const users = await models.User.findAll({
                        raw: true,
                        where: { id: { [models.sequelize.Op.in]: members } },
                    });
                    const name = users.map(u => u.username).join(', ');
                    const channelId = await models.sequelize
                        .transaction(async (transaction) => {
                            const channel = await models.Channel.create(
                                {
                                    name,
                                    public: false,
                                    dm: true,
                                    teamId,
                                },
                                { transaction },
                            );
                            const cId = channel.dataValues.id;
                            const pcmembers = allMembers.map(m => ({
                                userId: m, channelId: cId,
                            }));
                            await models.PrivateChannelMember.bulkCreate(
                                pcmembers,
                                { transaction },
                            );
                            return cId;
                        });

                    return {
                        id: channelId,
                        name,
                    };
                } catch (err) {
                    return {
                        ok: false,
                        errors: formateErrors(err, models),
                    };
                }
            },
        ),
        createChannel: requiresTeamAdminAccess.createResolver(
            async (_, args, { models, user }) => {
                try {
                    // create a common non dm channel
                    // in case of private channel set allowed members
                    const channel = await models.sequelize
                        .transaction(async (transaction) => {
                            const newChannel = await models.Channel
                                .create(args, { transaction });
                            if (args.private) {
                                const members = args.members.filter(m => m !== user.id);
                                members.push(user.id);
                                const privateMembers = members.map(m => ({
                                    userId: m,
                                    channelId: channel.dataValues.id,
                                }));
                                await models.PrivateChannelMember.bulkCreate(
                                    privateMembers,
                                    { transaction },
                                );
                            }
                            return newChannel;
                        });
                    return {
                        ok: true,
                        channel,
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
            async (_, { channelId, option, value }, { models }) => {
                try {
                    // update the channel
                    const updatedChannel = await models.sequelise.query(
                        `update channels
                            set :option = :value
                            where id = :channelId
                            `,
                        {
                            replacements: { option, value, channelId },
                            model: models.Channel,
                            raw: true,
                        },
                    );

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
                    // delete the channel, private channel members, channel messages
                    await models.sequelize.transaction(async (transaction) => {
                        await models.Message.destroy(
                            { where: { channelId } },
                            { transaction },
                        );
                        await models.PrivateChannelMember.destroy(
                            { where: { channelId } },
                            { transaction },
                        );
                        await models.Channel.destroy(
                            { where: { id: channelId } },
                            { transaction },
                        );
                    });

                    return true;
                } catch (err) {
                    return false;
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
