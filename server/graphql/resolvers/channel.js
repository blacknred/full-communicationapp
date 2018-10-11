import formateErrors from '../../formateErrors';
import { requiresAuth } from '../../permissions';

export default {
    Mutation: {
        getOrCreateChannel: requiresAuth.createResolver(
            async (parent, { teamId, members }, { models, user }) => {
                try {
                    // check if user is member of the team
                    const member = await models.TeamMember.findOne(
                        { where: { teamId, userId: user.id } },
                        { raw: true },
                    );
                    if (!member) throw new Error('Not Authorized');

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
        createChannel: requiresAuth.createResolver(
            async (parent, args, { models, user }) => {
                try {
                    // check if user is admin of the team
                    const member = await models.TeamMember
                        .findOne(
                            { where: { teamId: args.teamId, userId: user.id } },
                            { raw: true },
                        );
                    if (!member.admin) {
                        return {
                            ok: false,
                            errors: [{
                                path: 'name',
                                message: 'The operation needs team admin rights',
                            }],
                        };
                    }

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
        updateChannel: requiresAuth.createResolver(
            async (parent, { channelId, option, value }, { models, user }) => {
                try {
                    // check if user has the team admin rights
                    const isAdmin = await models.sequelize
                        .query(
                            `select * from team_members as tm
                            join teams as t on t.id = tm.team_id
                            join channels as c on c.team_id = t.id
                            where c.id = :channelId and tm.userId = : userId
                            and tm.admin = true and`,
                            {
                                replacements: { channelId, userId: user.id },
                                model: models.TeamMember,
                                raw: true,
                            },
                        );
                    if (!isAdmin) {
                        return {
                            ok: false,
                            errors: [{
                                message: 'The operation needs team admin rights',
                            }],
                        };
                    }

                    // update the channel
                    const updatedChannel = await models.sequelise
                        .query(
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
        deleteChannel: requiresAuth.createResolver(
            async (parent, { channelId }, { models, user }) => {
                try {
                    // check if user has the team admin rights
                    const isAdmin = await models.sequelize
                        .query(
                            `select * from team_members as tm
                            join teams as t on t.id = tm.team_id
                            join channels as c on c.team_id = t.id
                            where c.id = :channelId and tm.userId = : userId
                            and tm.admin = true and`,
                            {
                                replacements: { channelId, userId: user.id },
                                model: models.TeamMember,
                                raw: true,
                            },
                        );
                    if (!isAdmin) return false;

                    // delete the channel, private channel members, channel messages
                    await models.sequelize.transaction(async (transaction) => {
                        await models.Messages.destroy(
                            { where: { channelId } },
                            { transaction },
                        );
                        await models.PrivateChannelMember.destroy(
                            { where: { channelId } },
                            { transaction },
                        );
                        await models.Channels.destroy(
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
    },
};
