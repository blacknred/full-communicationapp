export default async (ids, models) => {
    const counts = await models.sequelize.query(
        `select m.channel_id, count(m.id) from messages as m
        where m.channel_id in (:ids)
        group by m.channel_id`,
        {
            replacements: { ids },
            model: models.Message,
            raw: true,
        },
    );

    // reorder the results due to the disorder of the channels
    return ids.map(id => counts.find(c => c.channel_id === id).count || 0);
};
