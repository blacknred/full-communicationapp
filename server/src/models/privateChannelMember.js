export default (sequelize) => {
    const PrivateChannelMember = sequelize.define(
        'private_channel_member',
        {},
        { timestamps: false },
    );

    return PrivateChannelMember;
};
