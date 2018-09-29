import _ from 'lodash';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SECRET = process.env.TOKEN_SECRET;
const SECRET2 = process.env.TOKEN_SECRET_2;

const createTokens = async ({ user, refreshTokenSecret }) => {
    const createToken = jwt.sign(
        { user: _.pick(user, ['id', 'username']) },
        SECRET,
        { expiresIn: '1h' },
    );

    const createRefreshToken = jwt.sign(
        { user: _.pick(user, 'id', 'username') },
        refreshTokenSecret,
        { expiresIn: '7d' },
    );

    return Promise.all([createToken, createRefreshToken]);
};

export const refreshTokens = async ({ token, refreshToken, models }) => {
    let userId = 0;
    try {
        const { user: { id } } = jwt.decode(refreshToken);
        userId = id;
    } catch (err) {
        return {};
    }

    if (!userId) return {};

    const user = await models.User.findOne({ where: { id: userId }, raw: true });

    if (!user) return {};

    const refreshSecret = user.password + SECRET2;

    try {
        jwt.verify(refreshToken, refreshSecret);
    } catch (err) {
        return {};
    }

    const [newToken, newRefreshToken] = await createTokens({
        user, refreshTokenSecret: refreshSecret,
    });
    return {
        token: newToken,
        refreshToken: newRefreshToken,
        user,
    };
};

export const tryLogin = async ({ email, password, models }) => {
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
        user, refreshTokenSecret,
    });
    return {
        ok: true,
        token,
        refreshToken,
    };
};

export const checkAuth = async (models, req, res, next) => {
    const token = req.headers['x-token'];
    if (token) {
        try {
            const { user } = jwt.verify(token, SECRET);
            req.user = user;
            console.log('user', req.user);
        } catch (err) {
            const refreshToken = req.headers['x-refresh-token'];
            const newTokens = await refreshTokens({
                token, refreshToken, models,
            });
            if (newTokens.token && newTokens.refreshToken) {
                res.set('Access-Control-Expose-Headers', 'x-token, x-refresh-token');
                res.set('x-token', newTokens.token);
                res.set('x-refresh-token', newTokens.refreshToken);
            }
        }
    }
    next();
};

export const checkAuth2 = async (models, token, refreshToken) => {
    let curUser = null;
    if (token && refreshToken) {
        try {
            const { user } = jwt.verify(token, SECRET);
            curUser = user;
        } catch (err) {
            const { user } = await refreshTokens({
                token, refreshToken, models,
            });
            curUser = user;
        }
    }
    return curUser;
};
