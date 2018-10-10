export default (sequelize, DataTypes) => {
    const Channel = sequelize.define(
        'channel',
        {
            name: DataTypes.STRING,
            private: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            dm: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
        },
    );

    Channel.associate = (models) => {
        Channel.belongsTo(models.Team, {
            foreignKey: {
                name: 'teamId',
                field: 'team_id',
            },
        });
        Channel.belongsToMany(models.User, {
            through: models.PrivateChannelMember,
            foreignKey: {
                name: 'channelId',
                field: 'channel_id',
            },
        });
        Channel.belongsToMany(models.User, {
            through: 'channel_members',
            foreignKey: {
                name: 'channelId',
                field: 'channel_id',
            },
        });
    };

    return Channel;
};
