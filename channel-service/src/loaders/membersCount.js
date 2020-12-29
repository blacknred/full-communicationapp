export default async (ids, models) => {
    const counts = await models.sequelize.query(
        `select count(*) from team_members as tm
        where tm.team_id in (:ids)
        group by tm.team_id
        order by tm.team_id asc`,
        {
            replacements: { ids },
            model: models.TeamMember,
            raw: true,
        },
    );

    return counts.map(c => c.count);
};
