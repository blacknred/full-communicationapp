import fs from 'fs';
import path from 'path';
import {
    pick,
} from 'lodash';
import Debug from 'debug';

import conf from '../config';

const debug = Debug('corporate-messenger:errors');

const ERROR_LOGS_PATH = path.join(conf.logs_path, 'errors.log');

const logFile = fs.createWriteStream(ERROR_LOGS_PATH, {
    flags: 'a',
});

function fileStderr(str, pre = '') {
    logFile.write(`${new Date()}: ${pre.toUpperCase()} ${str} \n`);
}

function formateErrors(e, models) {
    if (e instanceof models.sequelize.ValidationError) {
        return e.errors.map(x => pick(x, ['path', 'message']));
    }

    debug(e.message);
    fileStderr(e.message);

    return [{
        path: 'name',
        message: 'something went wrong',
    }];
}

export {
    fileStderr,
    formateErrors,
};
