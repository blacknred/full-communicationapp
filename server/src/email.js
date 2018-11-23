import nodemailer from 'nodemailer';

import credentials from './emailCredentials';

const USER = process.env.GMAIL_USER || credentials.user;
const PASSWORD = process.env.GMAIL_PASSWORD || credentials.password;

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: USER,
        pass: PASSWORD,
    },
});

export default transporter;
