export default (sequelize, DataTypes) => {
    const Channel = sequelize.define(
        'channel',
        {
            name: DataTypes.STRING,
            description: DataTypes.STRING,
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
            hooks: true,
            onDelete: 'CASCADE',
            through: models.PrivateChannelMember,
            foreignKey: {
                name: 'channelId',
                field: 'channel_id',
            },
        });
        Channel.belongsToMany(models.User, {
            hooks: true,
            onDelete: 'CASCADE',
            through: 'starred_channels',
            foreignKey: {
                name: 'channelId',
                field: 'channel_id',
            },
        });
        Channel.hasMany(models.Message, {
            hooks: true,
            onDelete: 'CASCADE',
            foreignKey: {
                name: 'channelId',
                field: 'channel_id',
            },
        });
    };

    return Channel;
};
