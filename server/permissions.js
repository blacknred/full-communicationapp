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

export const requiresAdmin = requiresAuth.createResolver((parent, args, { user }) => {
    if (!user.isAdmin) {
        throw new Error('Requires admin access');
    }
});

export const requiresTeamAccess = createResolver(
    async (parent, { channelId }, { user, models }) => {
        if (!user || !user.id) throw new Error('Not authenticated');
        // check if user is part of the team
        const channel = await models.Channel.findOne(
            { where: { id: channelId } },
            { raw: true },
        );
        const member = await models.TeamMember.findOne(
            { where: { teamId: channel.teamId, userId: user.id } },
            { raw: true },
        );
        if (!member) {
            throw new Error(`You have to be a member of the
            team to subscribe to messages`);
        }
    },
);

export const requiresDirectTeamAccess = createResolver(
    async (parent, { teamId, userId }, { user, models }) => {
        if (!user || !user.id) throw new Error('Not authenticated');
        // check if both members (user and receiver) are part of the team
        const members = await models.TeamMember.findAll({
            where: {
                teamId,
                [models.sequelize.Op.or]: [{ userId }, { userId: user.id }],
            },
        });
        if (members.length !== 2) {
            throw new Error('Something went wrong');
        }
    },
);
