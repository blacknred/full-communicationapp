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

    const [privateUsers, publicUsers] = await Promise.all([
        // in the case of a private channel, get the allowed users
        ids.private.length === 0 ? [] : await models.sequelize.query(
            `select u.id, u.username, u.fullname, u.email, pcm.channel_id from users as u
            join private_channel_members as pcm on pcm.user_id = u.id
            where pcm.channel_id in (:pids)
            order by u.id`,
            {
                replacements: { pids: ids.private },
                model: models.User,
                raw: true,
            },
        ),
        // otherwise get the users who have already posted messages in the channel
        ids.public.length === 0 ? [] : await models.sequelize.query(
            `select distinct on (u.id)
            u.id, u.username, u.fullname, u.email, m.channel_id from users as u
            join messages as m on m.user_id = u.id
            where m.channel_id in (:fids)
            order by u.id`,
            {
                replacements: { fids: ids.public },
                model: models.User,
                raw: true,
            },
        ),
    ]);

    // group by channel: [{},{},{},{}] => [[{},{}],[{},{}]]
    const users = [...privateUsers, ...publicUsers];

    return channels.map(ch => users.filter(u => u.channel_id === ch.id) || []);
    // const data = users.reduce((acc, u) => {
    //     if (acc[u.channel_id]) {
    //         acc[u.channel_id].push(u);
    //     } else {
    //         acc[u.channel_id] = [u];
    //     }
    //     return acc;
    // }, {});

    // return channels.map(ch => data[ch.id] || []);
};
