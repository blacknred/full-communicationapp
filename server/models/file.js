export default (sequelize, DataTypes) => {
    const File = sequelize.define(
        'file',
        {
            size: DataTypes.INTEGER,
            name: DataTypes.STRING,
            path: DataTypes.STRING,
            type: DataTypes.STRING,
            thumb: DataTypes.STRING,
            description: DataTypes.STRING,
        },
    );

    File.associate = (models) => {
        File.belongsTo(models.Message, {
            foreignKey: {
                name: 'messageId',
                field: 'message_id',
            },
        });
    };

    return File;
};
