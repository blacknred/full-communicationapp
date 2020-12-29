export default async (ids, models) => {
    const users = await models.sequelize.query(
        `select u.id, u.username, u.fullname from users as u
        where u.id in (:ids)`,
        {
            replacements: { ids },
            model: models.User,
            raw: true,
        },
    );

    // reorder the results due to the disorder of the messages
    return ids.map(id => users.find(u => u.id === id));
};
