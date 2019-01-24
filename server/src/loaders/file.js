export default async (ids, models) => {
    const files = await models.sequelize
        .query(
            `select * from files as f
            where f.message_id in (:messageIds)`,
            {
                replacements: { messageIds: ids },
                model: models.File,
                raw: true,
            },
        );

    // group by message id
    // [[{},{}],[{},{}]]
    const data = {};
    files.forEach((file) => {
        if (data[file.message_id]) {
            data[file.message_id].push(file);
        } else {
            data[file.message_id] = [file];
        }
    });

    return ids.map(id => data[id] || []);
};
