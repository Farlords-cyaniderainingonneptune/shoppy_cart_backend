import * as authModel from '../models/models.auth.js';
import * as Hash from '../../lib/utils/utils.hash.js';
import * as Helpers from '../../lib/utils/utils.helpers.js';
import sendMail from '../services/email.js';

export const register = async (req, res) => {
    try{
    const { email, password, confirm_password} = req.body
    if (!email || !password ||!confirm_password) {
        return res.status(422).json({
            status: 'error',
            code: 422,
            message: 'email, password and full_name are required'
        })
    }

    if (!email.includes('@')) {
        return res.status(422).json({
            status: 'error',
            code: 422,
            message: 'email is invalid'
        })
    }
    if (password !== confirm_password){
        return res.status(422).json({
            status:"error",
            code:422,
            message:"passwords don't match"
        })
    }

    const existingEmail = await authModel.checkUserExistsByEmail(email);
    if (existingEmail) {
        return res.status(409).json({
            status: 'error',
            code: 409,
            message: 'email already exists'
        })
    }

    // hash password
    const hash = await Hash.hashData(password);
    const verificationCode = Helpers.generateVerificationCode(6);
    const verificationCodeDuration = 10; // in minutes
    const verificationCodeExpireAt = new Date(Date.now() + verificationCodeDuration * 60 * 1000);

    //  send verification email to users
    const Content =`Hello ${email}, kindly verify your admin account using this OTP: ${verificationCode}. This OTP will expire in ${verificationCodeDuration} mins`
    await sendMail(email,'Verify Your Account', Content);
    // save to the DB
    const newUser = await authModel.createUser(email, hash, verificationCode, verificationCodeExpireAt);
    return res.status(201).json({
        status: 'success',
        code: 201,
        message: 'Account created successfully',
        data: newUser
    })
    }catch(err){
    return res.status(500).json({
            status: 'error',
            code: 500,
            message: err.message
        })
}
};

export const verifyAccount = async (req, res) => {
    try{
    const {email, verification_code} = req.body;
    if (!verification_code || !email) {
        return res.status(422).json({
            status: 'error',
            code: 422,
            message: 'verification_code and email are required'
        })
    };
    if (verification_code.length !== 6) {
        return res.status(422).json({
            status: 'error',
            code: 422,
            message: 'verification_code must be 8 digits'
        })
    };

    const userDetails = await authModel.checkIfUserActivelyExistsByEmail(email);
    if (!userDetails) {
        return res.status(401).json({
            status: 'error',
             code: 401,
             message: 'Invalid email, user does not exist'
        })
    };

    if (userDetails.is_verified_account) {
        return res.status(400).json({
            status: 'error',
             code: 400,
             message: 'Account already verified'
        })
    };

    if (userDetails.verification_code_expire_at < new Date()) {
        return res.status(401).json({
            status: 'error',
             code: 401,
             message: 'Verification code has expired'
        })
    };

    if (verification_code !== userDetails.verification_code) {
        return res.status(401).json({
            status: 'error',
            code: 401,
            message: 'Invalid verification code'
        })
    };

    // send welcome email to users 
    const Content =`Hello ${email}. Welcome to Shoppy Cart. Your account has been successfully verified.`
    await sendMail(email,'Account Verified', Content);

    const verifyUser = await authModel.updateUserVerification(email);
    return res.status(200).json({
        status: 'success',
        code: 200,
        message: 'Account verified successfully',
        data: verifyUser
    })
    }catch(err){
        return res.status(500).json({
            status:'error',
            code:500,
            message:err.message
        })
    }
};

export const resendVerificationCode = async (req, res) => {
    try{
    const { email } = req.body;

    if (!email) {
        return res.status(422).json({
            status: 'error',
            code: 422,
            message: 'email is required'
        })
    }

    const userDetails = await authModel.checkIfUserActivelyExistsByEmail(email);
    if (!userDetails) {
        return res.status(401).json({
            status: 'error',
             code: 401,
             message: 'Invalid email, user does not exist'
        })
    }

    if (userDetails.is_verified_account) {
        return res.status(400).json({
            status: 'error',
             code: 400,
             message: 'Account already verified'
        })
    }

   // generate unique identifier/otp
    const verificationCode = Helpers.generateVerificationCode(6);
    const verificationCodeDuration = 10; // in minutes
    const verificationCodeExpireAt = new Date(Date.now() + verificationCodeDuration * 60 * 1000);

    const Content =`Hello ${userDetails.display_name}, kindly verify your account using this OTP: ${verificationCode}. This OTP will expire in ${verificationCodeDuration} mins.`
    await sendMail(email,'Verify Your Account', Content);
    const updatedUser = await authModel.updateUserVerificationCode(email, verificationCode, verificationCodeExpireAt);

    // send email of new otp verification code
    if (process.env.NODE_ENV === 'production') {
        delete updatedUser.verification_code;
    }
    return res.status(200).json({
        status: 'success',
         code: 200,
         message: 'Verification code resent successfully',
         data: updatedUser
    })
    }catch(error){
            return res.status(500).json({
            status: 'error',
            code: 500,
            message: error.message
        })
}
};

export const login = async (req, res) => {
    try{
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(422).json({
            status: 'error',
            code: 422,
            message: 'email and password are required'
        })
    };
    const userExists = await authModel.checkUserExistsByEmail(email);
    if (!userExists){
        return res.status(401).json({
            status: 'error',
            code: 401,
            message: 'Invalid credentials'
        })
    };

    const userPasswordDetails = await authModel.userPassword(userExists.user_id);
    const validPassword = await Hash.compareData(password, userPasswordDetails.password);
    if (!validPassword) {
        return res.status(401).json({
            status: 'error',
            code: 401,
            message: 'Invalid login credentials'
        })
    };

    const allowedStatuses = [ 'active', 'inactive' ]
    if (!allowedStatuses.includes(userExists.status)) {
        return res.status(401).json({
            status: 'error',
            code: 401,
            message: `User account is ${userExists.status}, kindly contact support team`
        })
    }
    // generate jwt token to manage sessions
    const token = Helpers.generateJWTToken(userExists);
    await authModel.updateUserOnLogin(userExists.user_id);
    return res.status(200).json({
        status: 'success',
         code: 200,
         message: 'User logged in successfully',
         data: { ...userExists, token }
    })
}catch(error){
            return res.status(500).json({
            status: 'error',
            code: 500,
            message: error.message
        })
}
};

export const logout = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const isLoggedIn = await authModel.isLoggedIn(userId);
        if (!isLoggedIn){
            return res.status(409).json({
                status:'Conflict',
                code:401,
                message:`unable to complete action`
            })
        }
        await authModel.updateUserOnLogout(userId)
        return res.status(200).json({
            status:'success',
            code: 200,
            message:'Logged out successfully'
        })
    }catch(err){
        return res.status(500).json({
            status: 'error',
            code: 500,
            message: err.message
        })
    }
}

export const adminLogin = async (req, res) => {
    try{
    const { email, password} = req.body
    if (!password || !email) {
        return res.status(422).json({
            status: 'error',
            code: 422,
            message: 'password is required'
        })
    }

    const userExists = await authModel.checkIfUserActivelyExistsByEmailAndUsername(email);
    if (!userExists) {
        return res.status(401).json({
            status: 'error',
            code: 401,
            message: 'Invalid login credentials'
        })
    };
    
    const userPasswordDetails = await authModel.userPassword(userExists.user_id);
    const validPassword = await Hash.compareData(password, userPasswordDetails.password);
    if (!validPassword) {
        return res.status(401).json({
            status: 'error',
            code: 401,
            message: 'Invalid login credentials'
        })
    }

    const allowedStatuses = [ 'active', 'inactive']
    if (!allowedStatuses.includes(userExists.status)) {
        return res.status(401).json({
            status: 'error',
            code: 401,
            message: `User account is ${userExists.status}, kindly contact support team`
        })
    }

    // generate jwt token to manage sessions
    const token = Helpers.generateJWTToken(userExists);
    const actualSuperAdmin= await authModel.checkIfSuperAdmin(userExists.user_id);
    if(actualSuperAdmin){
        const updatedSuperAdmin = await authModel.updateSuperAdminOnLogin(userExists.user_id);
        return res.status(200).json({
        status: 'success',
         code: 200,
         message: 'User logged in as superAdmin successfully',
         data: { ...updatedSuperAdmin, token }
        })
    }
    const adminVerified = await adminModel.verifiedAdmin(email)
    if(!adminVerified){
        return res.status(401).json({
            status:'error',
            code:'401',
            message:'Unauthorized access'
        })
    }
    await authModel.updateAdminOnLogin(userExists.user_id);
    return res.status(200).json({
        status: 'success',
         code: 200,
         message: 'User logged in as Admin successfully',
         data: { ...userExists, token }
    });
    }catch(err){
        return res.status(500).json({
            status:'error',
            code:500,
            message:err.message
        })
    };
};

export const adminLogout = async (req, res)=> {
    try{
        const userId = req.user.user_id;
        const isLoggedIn = await authModel.isLoggedIn(userId);
        if (!isLoggedIn){
            return res.status(401).json({
                status:'bad request',
                code:401,
                message:`unable to complete action`
            })
        }
        await authModel.updateAdminOnLogout(userId)
        return res.status(200).json({
            status:'success',
            code: 200,
            message:'you have been logged out successfully'
        })
    }catch(err){
        return res.status(500).json({
            status: 'error',
            code: 500,
            message: err.message
        })
    }
};

/**
 * Google OAuth Callback Handler
 * Called after successful Google OAuth authentication
 * Generates JWT token and returns user data
 */
export const googleCallback = async (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(401).json({
                status: 'error',
                code: 401,
                message: 'OAuth authentication failed'
            });
        }

        // Generate JWT token for API access
        const token = Helpers.generateJWTToken(user);

        return res.status(200).json({
            status: 'success',
            code: 200,
            message: 'Successfully logged in with Google',
            data: {
                user_id: user.user_id,
                email: user.email,
                display_name: user.display_name,
                google_id: user.google_id,
                is_verified_account: user.is_verified_account,
                status: user.status
            },
            token
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            code: 500,
            message: error.message || 'OAuth callback failed'
        });
    }
};

/**
 * Link Google Account to Existing Email User
 * Requires JWT authentication from email/password login
 * Adds google_id to existing user account
 */
export const linkGoogleAccount = async (req, res) => {
    try {
        const { google_id } = req.body;
        const userEmail = req.user.email;

        if (!google_id) {
            return res.status(422).json({
                status: 'error',
                code: 422,
                message: 'google_id is required'
            });
        }

        // Verify google_id is not already linked to another user
        const existingGoogleUser = await authModel.findOAuthUser(google_id);
        if (existingGoogleUser && existingGoogleUser.user_id !== req.user.user_id) {
            return res.status(409).json({
                status: 'error',
                code: 409,
                message: 'This Google account is already linked to another user'
            });
        }

        // Link google_id to current user
        const updatedUser = await authModel.linkGoogleToEmail(userEmail, google_id);

        if (!updatedUser) {
            return res.status(500).json({
                status: 'error',
                code: 500,
                message: 'Failed to link Google account'
            });
        }
        const Content =`Welcome to Shoppy Cart, your best online grocery manager.`
        await sendMail(userEmail,'Welcome', Content)
        return res.status(200).json({
            status: 'success',
            code: 200,
            message: 'Google account linked successfully',
            data: {
                user_id: updatedUser.user_id,
                email: updatedUser.email,
                display_name: updatedUser.display_name,
                google_id: updatedUser.google_id,
                is_verified_account: updatedUser.is_verified_account
            }
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            code: 500,
            message: error.message || 'Failed to link Google account'
        });
    }
};

/**
 * OAuth Logout Handler
 * Destroys Passport session and clears session data
 */
export const logoutOAuth = async (req, res) => {
    try {
        req.logout((err) => {
            if (err) {
                return res.status(500).json({
                    status: 'error',
                    code: 500,
                    message: 'Logout failed: ' + err.message
                });
            }

            // Destroy session
            req.session.destroy((err) => {
                if (err) {
                    return res.status(500).json({
                        status: 'error',
                        code: 500,
                        message: 'Session destruction failed: ' + err.message
                    });
                }

                return res.status(200).json({
                    status: 'success',
                    code: 200,
                    message: 'Successfully logged out from Google'
                });
            });
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            code: 500,
            message: error.message || 'Logout failed'
        });
    }
};