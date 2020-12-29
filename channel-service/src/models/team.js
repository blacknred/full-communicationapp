export default (sequelize, DataTypes) => {
    const Team = sequelize.define('team', {
        name: {
            type: DataTypes.STRING,
            unique: true,
            validate: {
                is: {
                    args: ['^[a-zA-Z0-9 ]+$', 'i'],
                    msg: 'Can only contain letters, numbers and space',
                },
            },
        },
        description: DataTypes.STRING,
    });

    Team.associate = (models) => {
        Team.belongsToMany(models.User, {
            hooks: true,
            onDelete: 'CASCADE',
            through: models.TeamMember,
            foreignKey: {
                name: 'teamId',
                field: 'team_id',
            },
        });
        Team.hasMany(models.Channel, {
            hooks: true,
            onDelete: 'CASCADE',
            foreignKey: {
                name: 'teamId',
                field: 'team_id',
            },
        });
    };

    return Team;
};
