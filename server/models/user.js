import bcrypt from 'bcryptjs';

export default (sequelize, DataTypes) => {
    const User = sequelize.define(
        'user',
        {
            username: {
                type: DataTypes.STRING,
                unique: true,
                validate: {
                    isAlphanumeric: {
                        args: true,
                        msg: 'The username can only contain letters and numbers',
                    },
                    len: {
                        args: [3, 25],
                        msg: 'The username needs to be between 3 and 25 characters long',
                    },
                },
            },
            email: {
                type: DataTypes.STRING,
                unique: true,
                validate: {
                    isEmail: {
                        mgs: 'Invalid email',
                    },
                },
            },
            password: {
                type: DataTypes.STRING,
                validate: {
                    len: {
                        args: [5, 100],
                        msg: 'The password needs to be between 5 and 100 characters long',
                    },
                },
            },
        },
        {
            hooks: {
                afterValidate: async (user) => {
                    // eslint-disable-next-line no-param-reassign
                    user.password = await bcrypt.hash(user.password, 12);
                },
            },
        },
    );

    User.associate = (models) => {
        User.belongsToMany(models.Team, {
            through: models.TeamMember,
            foreignKey: {
                name: 'userId',
                field: 'user_id',
            },
        });
        User.belongsToMany(models.Channel, {
            through: 'channel_members',
            foreignKey: {
                name: 'userId',
                field: 'user_id',
            },
        });
        User.belongsToMany(models.Channel, {
            through: 'private_channel_members',
            foreignKey: {
                name: 'userId',
                field: 'user_id',
            },
        });
    };

    return User;
};
