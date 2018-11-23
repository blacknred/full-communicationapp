export default (sequelize, DataTypes) => {
    const Team = sequelize.define(
        'team',
        {
            name: {
                type: DataTypes.STRING,
                unique: true,
                validate: {
                    isAlphanumeric: {
                        args: true,
                        msg: 'The name can only contain letters and numbers',
                    },
                },
            },
            description: DataTypes.STRING,
        },
    );

    Team.associate = (models) => {
        Team.belongsToMany(models.User, {
            through: models.TeamMember,
            foreignKey: {
                name: 'teamId',
                field: 'team_id',
            },
        });
    };

    return Team;
};
