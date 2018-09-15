import _ from 'lodash';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const createTokens = async ({ user, SECRET, refreshTokenSecret }) => {
    const createToken = jwt.sign(
        {
            user: _.pick(user, ['id', 'username']),
        },
        SECRET,
        {
            expiresIn: '1h',
        },
    );

    const createRefreshToken = jwt.sign(
        {
            user: _.pick(user, 'id', 'username'),
        },
        refreshTokenSecret,
        {
            expiresIn: '7d',
        },
    );

    return Promise.all([createToken, createRefreshToken]);
};

export const refreshTokens = async ({ token, refreshToken, models, SECRET, SECRET2 }) => {
    let userId = 0;
    try {
        const { user: { id } } = jwt.decode(refreshToken);
        userId = id;
    } catch (err) {
        return {};
    }

    if (!userId) {
        return {};
    }

    const user = await models.User.findOne({ where: { id: userId }, raw: true });

    if (!user) {
        return {};
    }

    const refreshSecret = user.password + SECRET2;

    try {
        jwt.verify(refreshToken, refreshSecret);
    } catch (err) {
        return {};
    }

    const [newToken, newRefreshToken] = await createTokens({
        user, SECRET, refreshTokenSecret: refreshSecret,
    });
    return {
        token: newToken,
        refreshToken: newRefreshToken,
        user,
    };
};

export const tryLogin = async ({ email, password, models, SECRET, SECRET2 }) => {
    // is user exist
    const user = await models.User.findOne({ where: { email }, raw: true });
    if (!user) {
        return {
            ok: false,
            errors: [
                {
                    path: 'email',
                    message: 'Wrong email',
                },
            ],
        };
    }

    // is password valid
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
        return {
            ok: false,
            errors: [
                {
                    path: 'password',
                    message: 'Wrong password',
                },
            ],
        };
    }

    // create token
    const refreshTokenSecret = user.password + SECRET2;
    const [token, refreshToken] = await createTokens({
        user, SECRET, refreshTokenSecret,
    });
    return {
        ok: true,
        token,
        refreshToken,
    };
};
