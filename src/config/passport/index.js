import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import * as authModel from '../../api/models/models.auth.js';

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const email = profile.emails[0].value;
        const displayName = profile.displayName;

        // Check if user exists by google_id
        let user = await authModel.findOAuthUser(googleId);

        if (user) {
          // User exists, return user
          return done(null, user);
        }

        // Check if email already exists (email/password user)
        const existingEmailUser = await authModel.checkUserExistsByEmail(email);
        
        if (existingEmailUser) {
          // Link google_id to existing email account
          user = await authModel.linkGoogleToEmail(email, googleId);
          return done(null, user);
        }

        // Create new OAuth user
        user = await authModel.createOAuthUser(email, displayName, googleId);
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Serialize user - store user_id in session
passport.serializeUser((user, done) => {
  done(null, user.user_id);
});

// Deserialize user - fetch user from DB using user_id
passport.deserializeUser(async (user_id, done) => {
  try {
    const user = await authModel.findUserById(user_id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
