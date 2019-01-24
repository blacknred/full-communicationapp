export default async (ids, models) => {
    const users = await models.sequelize
        .query(
            `select * from users as u
            where u.id in (:userIds)`,
            {
                replacements: { userIds: ids },
                model: models.User,
                raw: true,
            },
        );

    // group by user id
    // [{},{}]
    return ids.map(id => users.find(user => user.id === id));
};
