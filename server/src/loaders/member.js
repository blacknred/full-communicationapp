export default async (ids, models) => {
    const users = await models.sequelize.query(
        `select tm.team_id, u.id, u.username, u.fullname, u.email from users as u
        join team_members as tm on tm.user_id = u.id
        where tm.team_id in (:ids)
        order by u.id asc`, // tm.team_id
        {
            replacements: { ids },
            model: models.User,
            raw: true,
        },
    );

    // group by team: [{},{},{},{}] => [[{},{}],[{},{}]]
    return ids.map(id => users.filter(u => u.team_id === id) || []);
    // const data = users.reduce((acc, u) => {
    //     if (acc[u.team_id]) {
    //         acc[u.team_id].push(u);
    //     } else {
    //         acc[u.team_id] = [u];
    //     }
    //     return acc;
    // }, {});

    // return ids.map(id => data[id] || []);
};
