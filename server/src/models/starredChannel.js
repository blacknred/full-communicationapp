export default (sequelize) => {
    const StarredChannels = sequelize.define('starred_channels', {}, {
        timestamps: false,
    });

    return StarredChannels;
};
