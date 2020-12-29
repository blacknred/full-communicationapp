import {
    createInviteToken,
} from '../../auth';
import {
    formateErrors,
} from '../../helpers';
import {
    requiresAuth,
    requiresTeamAccess,
    requiresTeamAdminAccess,
} from '../../permissions';
import getTemplate from '../../emailTemplates';

export default {
    Team: {
        admin: ({ id }, _, { loaders }) => loaders.admin.load(id),
        channels: ({ id }, _, { loaders }) => loaders.channel.load(id),
        members: ({ id }, _, { loaders }) => loaders.member.load(id),
        membersCount: ({ id }, _, { loaders }) => loaders.membersCount.load(id),
        updatesCount: ({ id }, _, { loaders }) => loaders.teamUpdatesCount.load(id),
    },
    Query: {
        getTeam: requiresTeamAccess.createResolver(
            (_, { teamId }, { models }) => models.Team.findByPk(teamId),
        ),
        getTeams: requiresAuth.createResolver(
            (_, __, { models, user }) => models.sequelize.query(
                `select * from teams as t
                join team_members as tm on t.id = tm.team_id
                where tm.user_id = ?`,
                {
                    replacements: [user.id],
                    model: models.Team,
                    raw: true,
                },
            ),
        ),
    },
    Mutation: {
        createTeam: requiresAuth.createResolver(
            async (_, args, { models, user }) => {
                try {
                    // check if team with this name exists
                    const isExist = await models.Team.findOne({
                        where: { name: args.name },
                        raw: true,
                    });

                    if (isExist) {
                        return {
                            ok: false,
                            errors: [{
                                path: 'name',
                                message: 'The team with this name already exists',
                            }],
                        };
                    }

                    const team = await models.sequelize
                        .transaction(async (transaction) => {
                            // create a new team
                            const newTeam = await models.Team.create(
                                { ...args },
                                { transaction },
                            );

                            // create a 'general' public channel
                            const channel = await models.Channel.create(
                                {
                                    name: 'general',
                                    private: false,
                                    teamId: newTeam.dataValues.id,
                                },
                                { transaction },
                            );

                            // create a team admin entry
                            await models.TeamMember.create(
                                {
                                    teamId: newTeam.dataValues.id,
                                    userId: user.id,
                                    admin: true,
                                },
                                { transaction },
                            );

                            // create announcement message in channel
                            await models.Message.create(
                                {
                                    text: 'Channel was created!',
                                    userId: user.id,
                                    announcement: true,
                                    channelId: channel.dataValues.id,
                                },
                                { transaction },
                            );

                            return newTeam;
                        });

                    return {
                        ok: true,
                        team,
                    };
                } catch (err) {
                    return {
                        ok: false,
                        errors: formateErrors(err, models),
                    };
                }
            },
        ),
        addTeamMember: requiresTeamAdminAccess.createResolver(
            async (_, { teamId, email }, { models, emailTransporter, referrer }) => {
                try {
                    // check if valid email
                    if (!/\S+@\S+/.test(email)) {
                        return {
                            ok: false,
                            errors: [{
                                path: 'email',
                                message: 'Not valid url',
                            }],
                        };
                    }
                    // check if new member is a valid user
                    // if not, create short lived token -
                    // an invitation to the team and send it by email
                    const isValidUser = await models.User.findOne({
                        where: { email },
                        raw: true,
                    });

                    if (!isValidUser) {
                        const team = await models.Team.findByPk(teamId);

                        const token = await createInviteToken({ teamId });

                        await emailTransporter.sendMail({
                            from: 'swoy-inviteservice@gmail.com',
                            to: email,
                            subject: `Invitation to team ${team.name}`,
                            html: getTemplate('envitation', {
                                name: team.name.charAt(0).toUpperCase() + team.name.substr(1),
                                token,
                                email,
                                referrer,
                            }),
                        });

                        return {
                            ok: true,
                            status: 'Invitation has been sent',
                        };
                    }

                    // check if user is already the team member
                    const isMember = await models.sequelize
                        .query(
                            `select * from team_members as tm
                            join users as u on u.id = tm.user_id
                            where u.email = :email and tm.team_id = :teamId`,
                            {
                                replacements: { email, teamId },
                                model: models.TeamMember,
                                raw: true,
                            },
                        );

                    if (isMember.length) {
                        return {
                            ok: false,
                            errors: [{
                                path: 'email',
                                message: 'The user allready in the team',
                            }],
                        };
                    }

                    // create a entry for new team member
                    await models.TeamMember.create({
                        userId: isValidUser.id,
                        teamId,
                    });

                    return {
                        ok: true,
                        status: 'New member has been added',
                    };
                } catch (err) {
                    return {
                        ok: false,
                        errors: formateErrors(err, models),
                    };
                }
            },
        ),
        createTeamAccessLink: requiresTeamAdminAccess.createResolver(
            async (_, { teamId, timespan }, { referrer }) => {
                try {
                    const validTimespan = Math.floor(Math.abs(timespan));

                    const token = await createInviteToken({ teamId }, validTimespan);

                    return `${referrer}/login?token=${token}`;
                } catch (e) {
                    return '';
                }
            },
        ),
        updateTeam: requiresTeamAdminAccess.createResolver(
            async (_, { teamId, ...args }, { models }) => {
                try {
                    // check if team name was changed with the name that already exists
                    const isExist = await models.Team.findOne({
                        where: { name: args.name.toLowerCase() },
                        raw: true,
                    });

                    if (isExist && isExist.id !== teamId) {
                        return {
                            ok: false,
                            errors: [{
                                path: 'name',
                                message: 'The team with this name already exists',
                            }],
                        };
                    }

                    const [, updatedTeam] = await models.Team.update(
                        args,
                        {
                            where: { id: teamId },
                            returning: true,
                        },
                    );

                    return {
                        ok: true,
                        team: updatedTeam[0],
                    };
                } catch (err) {
                    return {
                        ok: false,
                        errors: formateErrors(err, models),
                    };
                }
            },
        ),
        deleteTeam: requiresTeamAdminAccess.createResolver(
            async (_, { teamId }, { models }) => {
                try {
                    await models.Team.destroy(
                        { where: { id: teamId } },
                    );

                    return true;
                } catch (err) {
                    return false;
                }
            },
        ),
        leaveTeam: requiresTeamAccess.createResolver(
            async (_, { teamId }, { models, user }) => {
                try {
                    await models.TeamMember.destroy(
                        {
                            where: {
                                teamId,
                                userId: user.id,
                                admin: false,
                            },
                        },
                    );

                    return true;
                } catch (err) {
                    return false;
                }
            },
        ),
    },
};
