import { Router } from 'express';
import * as authController from '../controllers/controllers.auth.js';
import models from '../middlewares/middlewares.models.js';
import * as authMiddleware from '../middlewares/middlewares.auth.js';
import * as passportMiddleware from '../middlewares/middlewares.passport.js';
import schema from '../../lib/schemas/schema.auth.js';
import passport from '../../config/passport/index.js';

const router = Router();

router.post('/register',
     models(schema.signUp, 'payload'),
     authController.register);

router.post('/verify_account',
    models(schema.verify, 'payload'),
    authController.verifyAccount);

router.post('/resend_verification_code',
     models(schema.resendVerification, 'payload'),
    authController.resendVerificationCode);

router.post('/login', 
    models(schema.signIn, 'payload'), 
    authController.login);

router.post('/logout',
    authMiddleware.verifyToken,
    authController.logout
    );

// OAuth Routes
router.get('/google', 
    passport.authenticate('google', { 
        scope: ['profile', 'email']
    })
);

router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/login'
    }),
    authController.googleCallback
);

router.post('/link-google',
    authMiddleware.verifyToken,
    authController.linkGoogleAccount
);

router.post('/logout-oauth',
    passportMiddleware.requireOAuthUser,
    authController.logoutOAuth
);


export default router;