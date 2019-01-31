import redisClient from '../redis';

export default async (ids, models, user) => {
    const lastVisit = await redisClient.getAsync(`user_${user.id}_online`);
    const counts = await models.sequelize.query(
        // `select count(m.id) from messages as m
        // right join channels as c on m.channel_id = c.id
        // right join teams as t on c.team_id = t.id
        // where (t.id in (:ids))
        // and (m.created_at > to_timestamp(:lastVisit))
        // group by t.id
        // order by t.id asc
        // `,
        `select count(m.id) from (
            select * from messages
            where created_at > to_timestamp(:lastVisit)
        ) as m
        right join channels as c on m.channel_id = c.id
        right join teams as t on c.team_id = t.id
        where (t.id in (:ids))
        group by t.id
        order by t.id asc
        `,
        {
            replacements: {
                ids,
                lastVisit,
            },
            model: models.Message,
            raw: true,
        },
    );

    return counts.map(c => c.count || 0);
};
