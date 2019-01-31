export default async (ids, models, user) => {
    const channels = await models.sequelize.query(
        `select distinct on (id) *,
        case
        when sc.channel_id is not null and sc.user_id = :userId
        then true else false
        end as starred
        from channels as c
        left outer join private_channel_members as pcm
        on c.id = pcm.channel_id
        left outer join starred_channels as sc
        on c.id = sc.channel_id
        where c.team_id in (:ids)
        and (c.private = false or pcm.user_id = :userId)`,
        {
            replacements: {
                ids,
                userId: user.id,
            },
            model: models.Channel,
            raw: true,
        },
    );

    // group by team: [{},{},{},{}] => [[{},{}],[{},{}]]
    return ids.map(id => channels.filter(ch => ch.team_id === id) || []);
    // const data = channels.reduce((acc, ch) => {
    //     if (acc[ch.team_id]) {
    //         acc[ch.team_id].push(ch);
    //     } else {
    //         acc[ch.team_id] = [ch];
    //     }
    //     return acc;
    // }, {});

    // return ids.map(id => data[id] || []);
};
