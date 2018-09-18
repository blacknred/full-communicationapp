export default (sequelize, DataTypes) => {
    const Member = sequelize.define(
        'member', {
            userId: DataTypes.INTEGER,
            teamId: DataTypes.INTEGER,
        },
    );

    return Member;
};
