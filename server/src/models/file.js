export default (sequelize, DataTypes) => {
    const File = sequelize.define(
        'file',
        {
            size: DataTypes.INTEGER,
            name: DataTypes.STRING,
            path: {
                type: DataTypes.STRING,
                unique: true,
                validate: {
                    isUrl: {
                        args: true,
                        msg: 'Can only contain url',
                    },
                },
            },
            type: {
                type: DataTypes.STRING,
                unique: true,
                validate: {
                    isIn: {
                        args: [['png', 'jpg']],
                        msg: 'Invalid file type',
                    },
                },
            },
            thumb: {
                type: DataTypes.STRING,
                unique: true,
                validate: {
                    isUrl: {
                        args: true,
                        msg: 'Can only contain url',
                    },
                },
            },
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
