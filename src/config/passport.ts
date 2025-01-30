import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { IUserInterface, User } from '../models/User';
import { logger } from '../utils/logger';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// Only initialize Google Strategy if credentials are available
if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.BASE_URL || 'http://localhost:3000'}/auth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user:IUserInterface|null = await User.findOne({ googleId: profile.id });

          if (!user) {
            user = await User.create({
              googleId: profile.id,
              email: profile.emails?.[0]?.value,
              name: profile.displayName,
            });
            logger.info(`New user created: ${user.email}`);
          }

          return done(null, user);
        } catch (error) {
          logger.error('Error in Google authentication:', error);
          return done(error as Error);
        }
      }
    )
  );
} else {
  logger.warn('Google OAuth credentials not found. Authentication will be disabled.');
}

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    logger.error('Error deserializing user:', error);
    done(error);
  }
});

export const initializePassport = (): void => {
  passport.initialize();
  passport.session();
};