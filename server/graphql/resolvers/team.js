import formateErrors from '../../formateErrors';

export default {
    Mutation: {
        createTeam: async (parent, args, { models, user }) => {
            try {
                await models.Team.create({
                    ...args,
                    owner: user.id,
                });
                return {
                    ok: true,
                };
            } catch (err) {
                return {
                    ok: false,
                    errors: formateErrors(err, models),
                };
            }
        },
    },
};
