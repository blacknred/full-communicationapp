export default async (ids, models) => {
    const counts = await models.sequelize.query(
        `select c.id, count(f.id) from files as f
        right join messages as m on f.message_id = m.id
        right join channels as c on m.channel_id = c.id
        where c.id in (:ids)
        group by c.id`,
        {
            replacements: { ids },
            model: models.File,
            raw: true,
        },
    );

    // reorder the results due to the disorder of the channels
    return ids.map(id => counts.find(c => c.id === id).count || 0);
};

// `select c.id, count(f.id) from channels as c
// left join messages as m on c.id = m.channel_id
// left join files as f on m.id = f.message_id
// where c.id in (:ids)
// group by c.id`,
