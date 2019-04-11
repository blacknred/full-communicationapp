import nodemailer from 'nodemailer';

import conf from '../config';

/* email */

export default nodemailer.createTransport({
    service: conf.email.service,
    auth: {
        user: conf.email.user,
        pass: conf.email.password,
    },
});
