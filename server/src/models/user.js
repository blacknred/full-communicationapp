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
                        msg: 'Can only contain letters and numbers',
                    },
                    len: {
                        args: [5, 25],
                        msg: 'Needs to be between 5 and 25 characters long',
                    },
                },
            },
            fullname: {
                type: DataTypes.STRING,
                validate: {
                    isAlpha: {
                        args: true,
                        msg: 'Can only contain letters',
                    },
                },
            },
            email: {
                type: DataTypes.STRING,
                unique: true,
                validate: {
                    isEmail: {
                        mgs: 'The email is invalid',
                    },
                },
            },
            password: {
                type: DataTypes.STRING,
                validate: {
                    len: {
                        args: [5, 20],
                        msg: 'Needs to be between 5 and 20 characters long',
                    },
                },
            },
        },
        {
            hooks: {
                afterValidate: async (user) => {
                    if (user.password) {
                        // eslint-disable-next-line no-param-reassign
                        user.password = await bcrypt.hash(user.password, 12);
                    }
                },
            },
        },
    );

    User.associate = (models) => {
        User.belongsToMany(models.Team, {
            hooks: true,
            // foreignKeyConstraint: true,
            onDelete: 'CASCADE',
            through: models.TeamMember,
            foreignKey: {
                name: 'userId',
                field: 'user_id',
            },
        });
        User.belongsToMany(models.Channel, {
            hooks: true,
            onDelete: 'CASCADE',
            through: models.PrivateChannelMember,
            foreignKey: {
                name: 'userId',
                field: 'user_id',
            },
        });
        User.belongsToMany(models.Channel, {
            hooks: true,
            onDelete: 'CASCADE',
            through: 'starred_channels',
            foreignKey: {
                name: 'userId',
                field: 'user_id',
            },
        });
    };

    return User;
};
