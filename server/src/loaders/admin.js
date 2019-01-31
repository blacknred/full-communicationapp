export default async (ids, models) => models.sequelize.query(
    `select u.id, u.username, u.fullname from users as u
    join team_members as tm on u.id = tm.user_id
    where tm.team_id in (:ids) and tm.admin = true
    order by tm.team_id asc`,
    {
        replacements: { ids },
        model: models.User,
        raw: true,
    },
);
