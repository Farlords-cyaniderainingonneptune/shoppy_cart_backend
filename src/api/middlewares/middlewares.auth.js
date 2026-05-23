import * as authModel from '../models/models.auth.js';
import * as Helpers from '../../lib/utils/utils.helpers.js';


export const verifyToken = async function (req, res, next) {
    try {
        let token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({
                status: 'error',
                code: 401,
                message: 'Please provide a token'
            })
        }

        if (!token.startsWith('Bearer ')) {
        return res.status(401).json({
            status: 'error',
            code: 401,
            message: 'Invalid token sent'
        })
        }

        if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
        }

        const decodedToken = Helpers.decodeJWTToken(token);

        const user = await authModel.checkIfUserActivelyExistsByUserId(decodedToken.user_id);
        if (!user) {
            return res.status(401).json({
                status: 'error',
                code: 401,
                message: 'Invalid token'
            })
        }
        const errorMessage = user.status === 'inactive' ? 'User account is inactive, kindly verify your account in your email, or request another verification' :
            `User account is ${user.status}, kindly contact support team`;

        if (user && user.status !== 'active') {
            return res.status(401).json({
                status: 'error',
                code: 401,
                message: errorMessage
            })
        }
        req.user = user;
        return next();
    } catch (error) {
        if (error.message) {
            if (error.message.trim().toLowerCase() === 'jwt expired') {
                return res.status(401).json({
                    status: 'error',
                    code: 401,
                    message: 'Session timeout'
                })
            }
            return res.status(401).json({
                status: 'error',
                code: 401,
                message: error.message
            })
        }
    }
}
export const verifyAdminToken = async function (req, res, next) {
    try {
        let token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({
                status: 'error',
                code: 401,
                message: 'Please provide a token'
            })
        }

        if (!token.startsWith('Bearer ')) {
        return res.status(401).json({
            status: 'error',
            code: 401,
            message: 'Invalid token sent'
        })
        }

        if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
        }

        const decodedToken = Helpers.decodeJWTToken(token);

        const user = await authModel.checkIfAdminOrSuperAdmin(decodedToken.user_id);
        if (!user) {
            return res.status(401).json({
                status: 'error',
                code: 401,
                message: 'Invalid token'
            })
        }
        const errorMessage = user.status === 'inactive' ? 'User account is inactive, kindly verify your account in your email, or request another verification' :
            `User account is ${user.status}, kindly contact support team`;

        if (user && user.status !== 'active') {
            return res.status(401).json({
                status: 'error',
                code: 401,
                message: errorMessage
            })
        }
        req.user = user;
        return next();
    } catch (error) {
        if (error.message) {
            if (error.message.trim().toLowerCase() === 'jwt expired') {
                return res.status(401).json({
                    status: 'error',
                    code: 401,
                    message: 'Session timeout'
                })
            }
            return res.status(401).json({
                status: 'error',
                code: 401,
                message: error.message
            })
        }
    }
};

export const verifyResetToken = async function (req, res, next) {
    try {
        let token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({
                status: 'error',
                code: 401,
                message: 'Please provide a token'
            })
        }
        if (!token.startsWith('Bearer ')) {
        return res.status(401).json({
            status: 'error',
            code: 401,
            message: 'Invalid token sent'
        })
        }
        if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
        }
        const decodedToken = Helpers.decodeJWTToken(token);
        const user = await authModel.checkIfUserActivelyExistsByUserId(decodedToken.user_id);
        if (!user) {
            return res.status(401).json({
                status: 'error',
                code: 401,
                message: 'Invalid token'
            })
        }
        if (user && user.status !== 'active') {
            return res.status(401).json({
                status: 'error',
                code: 401,
                message: 'User account is not active'
            })
        };
        req.user = user;
        return next();
    } catch (error) {
        if (error.message) {
            if (error.message.trim().toLowerCase() === 'jwt expired') {
                return res.status(401).json({
                    status: 'error',
                    code: 401,
                    message: 'Session timeout'
                })
            }
            return res.status(401).json({
                status: 'error',
                code: 401,
                message: error.message
            })
        }
    }
};
export const verifyForgotToken = async function (req, res, next) {
    try {
        let token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({
                status: 'error',
                code: 401,
                message: 'Please provide a token'
            })
        }
        if (!token.startsWith('Bearer ')) {
        return res.status(401).json({
            status: 'error',
            code: 401,
            message: 'Invalid token sent'
        })
        }
        if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
        }
        const decodedToken = Helpers.decodeJWTToken(token);
        const user = await authModel.checkIfUserActivelyExistsByUserId(decodedToken.user_id);
        if (!user) {
            return res.status(401).json({
                status: 'error',
                code: 401,
                message: 'Invalid token'
            })
        }
        if (user && user.status !== 'active') {
            return res.status(401).json({
                status: 'error',
                code: 401,
                message: 'User account is not active'
            })
        };
        req.user = user;
        return next();
    } catch (error) {
        if (error.message) {
            if (error.message.trim().toLowerCase() === 'jwt expired') {
                return res.status(401).json({
                    status: 'error',
                    code: 401,
                    message: 'Session timeout'
                })
            }
            return res.status(401).json({
                status: 'error',
                code: 401,
                message: error.message
            })
        }
    }
};
