import formateErrors from '../../formateErrors';
import { requiresAuth } from '../../permissions';


export default {
    Mutation: {
        createChannel: requiresAuth.createResolver(
            async (parent, args, { models }) => {
                try {
                    const channel = await models.Channel.create(args);
                    return {
                        ok: true,
                        channel,
                    };
                } catch (err) {
                    return {
                        ok: false,
                        errors: formateErrors(err, models),
                    };
                }
            },
        ),
    },
};
