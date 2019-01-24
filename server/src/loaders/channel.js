export default async (ids, models, user) => {
    const channels = await models.sequelize
        .query(
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
            where c.team_id in (:teamIds)
            and (c.private = false or pcm.user_id = :userId)`,
            {
                replacements: { teamIds: ids, userId: user.id },
                model: models.Channel,
                raw: true,
            },
        );

    // group by team
    // [[{},{}],[{},{}]]
    const data = {};
    channels.forEach((ch) => {
        if (data[ch.team_id]) {
            data[ch.team_id].push(ch);
        } else {
            data[ch.team_id] = [ch];
        }
    });

    return ids.map(id => data[id] || []);
};
