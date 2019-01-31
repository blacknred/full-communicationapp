export default async (channels, models) => {
    // split channels by private field
    const ids = channels.reduce((acc, ch) => {
        if (ch.isPrivate) {
            acc.private.push(ch.id);
        } else {
            acc.public.push(ch.id);
        }
        return acc;
    }, {
        private: [],
        public: [],
    });

    const [privateChCounts, publicChCounts] = await Promise.all([
        // in the case of a private channel, get the number of allowed users
        ids.private.length === 0 ? [] : models.sequelize.query(
            `select pcm.channel_id, count(pcm.user_id)  
            from private_channel_members as pcm
            where pcm.channel_id in (:pids)
            group by pcm.channel_id`,
            {
                replacements: { pids: ids.private },
                model: models.PrivateChannelMember,
                raw: true,
            },
        ),
        // otherwise get the number of users who have already posted messages in the channel
        ids.public.length === 0 ? [] : models.sequelize.query(
            `select m.channel_id, count(distinct m.user_id)
            from messages as m
            where m.channel_id in (:fids)
            group by m.channel_id`,
            {
                replacements: { fids: ids.public },
                model: models.Message,
                raw: true,
            },
        ),
    ]);

    const counts = [...privateChCounts, ...publicChCounts];
    // reorder the results due to the disorder of the channels
    return channels.map(ch => counts.find(c => c.channel_id === ch.id).count || 0);
};

// if (isPrivate) {
//     return models.PrivateChannelMember.count({
//         where: { channelId: id },
//     });
// }
// // otherway get count of users have allready posted in channel
// return models.Message.aggregate('user_id', 'count', {
//     where: { channelId: id },
//     distinct: true,
// });
