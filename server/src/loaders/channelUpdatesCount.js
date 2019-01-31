import redisClient from '../redis';

export default async (ids, models, user) => {
    const lastVisit = await redisClient.getAsync(`user_${user.id}_online`);
    const counts = await models.sequelize.query(
        // `select c.id, count(m.id) from messages as m
        // right join channels as c on m.channel_id = c.id
        // where c.id in (:ids)
        // and (m.created_at > to_timestamp(:lastVisit))
        // group by c.id`,
        `select c.id, count(m.id) from (
            select * from messages
            where created_at > to_timestamp(:lastVisit) 
        ) as m
        right join channels as c on m.channel_id = c.id
        where (c.id in (:ids))
        group by c.id
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

    // reorder the results due to the disorder of the channels
    return ids.map(id => counts.find(c => c.id === id).count || 0);
};
