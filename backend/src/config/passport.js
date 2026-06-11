import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { userService } from "../services/userService.js";
import { getAdminEmails } from "../utils/env.js";

const callbackURL =
  process.env.GOOGLE_CALLBACK_URL ||
  `${process.env.SERVER_URL || "http://localhost:5000"}/api/auth/google/callback`;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "missing-google-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "missing-google-client-secret",
      callbackURL,
      passReqToCallback: true,
    },
    async (_req, _accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value?.toLowerCase();

        if (!email) {
          return done(new Error("Google account email is required"), null);
        }

        const adminEmails = getAdminEmails();
        const user = await userService.upsertGoogleUser({
          googleId: profile.id,
          name: profile.displayName || email.split("@")[0],
          email,
          avatar: profile.photos?.[0]?.value || "",
          role: adminEmails.includes(email) ? "admin" : "customer",
        });

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    },
  ),
);

export default passport;