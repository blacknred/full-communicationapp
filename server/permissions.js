const createResolver = (resolver) => {
    const baseResolver = resolver;
    baseResolver.createResolver = (childResolver) => {
        const newResolver = async (parent, args, context, info) => {
            await resolver(parent, args, context, info);
            return childResolver(parent, args, context, info);
        };
        return createResolver(newResolver);
    };
    return baseResolver;
};

export const requiresAuth = createResolver((parent, args, { user }) => {
    if (!user || !user.id) {
        throw new Error('Not authenticated');
    }
});

export const requiresTeamAccess = createResolver(
    async (parent, { teamId, channelId }, { user, models }) => {
        if (!user || !user.id) throw new Error('Not authenticated');
        let teamIdX;

        // check if user is the team member
        if (!teamId) {
            const channel = await models.Channel.findOne({
                where: { id: channelId },
                raw: true,
            });
            teamIdX = channel.teamId;
        } else {
            teamIdX = teamId;
        }
        const isTeamMember = await models.TeamMember.findOne({
            where: { teamId: teamIdX, userId: user.id },
            raw: true,
        });
        if (!isTeamMember) {
            throw new Error('The operation needs team member rights');
        }
    },
);

export const requiresTeamAdminAccess = createResolver(
    async (parent, { teamId, channelId }, { user, models }) => {
        if (!user || !user.id) throw new Error('Not authenticated');
        let isTeamAdmin;

        // check if user is the team admin
        if (teamId) {
            isTeamAdmin = await models.TeamMember.findOne({
                where: { teamId, userId: user.id, admin: true },
                raw: true,
            });
        } else {
            isTeamAdmin = await models.sequelize.query(
                `select * from team_members as tm
                join teams as t on t.id = tm.team_id
                join channels as c on c.team_id = t.id
                where c.id = :channelId and tm.user_id = :userId
                and tm.admin = true`,
                {
                    replacements: { channelId, userId: user.id },
                    model: models.TeamMember,
                    raw: true,
                },
            );
        }
        if (!isTeamAdmin) {
            throw new Error('The operation needs team admin rights');
        }
    },
);

export const requiresPrivateChannelAccess = createResolver(
    async (parent, { channelId }, { user, models }) => {
        if (!user || !user.id) throw new Error('Not authenticated');

        // check user access in case of private channel
        const channel = await models.Channel.findOne({
            where: { id: channelId },
            raw: true,
        });
        if (channel.private) {
            const isMember = await models.PrivateChannelMember.findOne({
                where: { channelId, user_id: user.id },
                raw: true,
            });
            if (!isMember) {
                throw new Error('The operation needs private channel access');
            }
        }
    },
);

export const requiresMessageFullAccess = createResolver(
    async (parent, { messageId, adminAccess }, { user, models }) => {
        if (!user || !user.id) throw new Error('Not authenticated');
        let isFullAccess;

        // in case of admin access
        // check if user is admin of a team that hosts the message
        if (adminAccess) {
            isFullAccess = await models.sequelize.query(
                `select user_id from team_members as tm
                left outer join teams as t on t.id = tm.team_id
                left outer join channels as c on c.team_id = t.id
                left outer join messages as m on m.channel_id = c.id
                where m.id = :messageId
                and tm.admin = true`,
                {
                    replacements: { messageId },
                    model: models.TeamMember,
                    raw: true,
                },
            );
        } else {
            // check if user is author of the message
            isFullAccess = await models.Message.findOne({
                where: { id: messageId, userId: user.id },
                raw: true,
            });
        }
        if (!isFullAccess) {
            throw new Error('The message is not exist or access is restricted');
        }
    },
);

// export const requiresDirectTeamAccess = createResolver(
//     async (parent, { teamId, userId }, { user, models }) => {
//         if (!user || !user.id) throw new Error('Not authenticated');
//         // check if both members (user and receiver) are part of the team
//         const members = await models.TeamMember.findAll({
//             where: {
//                 teamId,
//                 [models.sequelize.Op.or]: [{ userId }, { userId: user.id }],
//             },
//         });
//         if (members.length !== 2) {
//             throw new Error('Something went wrong');
//         }
//     },
// );
