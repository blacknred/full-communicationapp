import Debug from 'debug';
import { pick } from 'lodash';

const debug = Debug('corporate-messenger:errors');

export default (e, models) => {
    console.log(e.message);
    debug(e.message);

    if (e instanceof models.sequelize.ValidationError) {
        return e.errors.map(x => pick(x, ['path', 'message']));
    }
    return [{
        path: 'name',
        message: 'something went wrong',
    }];
};
