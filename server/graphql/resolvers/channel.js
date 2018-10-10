import formateErrors from '../../formateErrors';
import { requiresAuth } from '../../permissions';

export default {
    Mutation: {
        getOrCreateChannel: requiresAuth.createResolver(
            async (parent, { teamId, members }, { models, user }) => {
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
    },
};
