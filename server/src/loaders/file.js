export default async (ids, models) => {
    const files = await models.sequelize.query(
        `select * from files as f
        where f.message_id in (:ids)`,
        {
            replacements: { ids },
            model: models.File,
            raw: true,
        },
    );

    // group by message id: [{},{},{},{}] => [[{},{}],[{},{}]]
    return ids.map(id => files.filter(f => f.message_id === id) || []);
    // const data = files.reduce((acc, f) => {
    //     if (acc[f.message_id]) {
    //         acc[f.message_id].push(f);
    //     } else {
    //         acc[f.message_id] = [f];
    //     }
    //     return acc;
    // }, {});

    // return ids.map(id => data[id] || []);
};
