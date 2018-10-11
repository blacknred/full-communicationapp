export default (sequelize, DataTypes) => {
    const Message = sequelize.define(
        'message',
        {
            text: DataTypes.STRING,
            forwarded: {
                type: DataTypes.Boolean,
                defaultValue: false,
            },
            // type: {
            //     type: DataTypes.ENUM,
            //     values: ['channel', 'direct'],
            //     defaultValue: 'channel',
            // },
        },
    );

    Message.associate = (models) => {
        Message.belongsTo(models.User, {
            foreignKey: {
                name: 'userId',
                field: 'user_id',
            },
        });
        Message.belongsTo(models.Channel, {
            foreignKey: {
                name: 'channelId',
                field: 'channel_id',
            },
        });
    };

    return Message;
};
