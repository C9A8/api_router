import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { config } from "../config/env"; // your existing config
import pool from "./db"; // your DB connection

passport.use(
  new GoogleStrategy(
    {
      clientID: config.googleClientId,
      clientSecret: config.googleClientSecret,
      callbackURL: config.callback,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(new Error("No email in Google profile"), false);

        // Check if account exists
        const existingAccount = await pool.query(
          "SELECT * FROM accounts WHERE provider = $1 AND provider_id = $2",
          ["google", profile.id]
        );

        if (existingAccount.rows.length > 0) {
          return done(null, { id: existingAccount.rows[0].user_id });
        }

        // Create new user
        const newUser = await pool.query(
          "INSERT INTO users (email, name) VALUES ($1, $2) RETURNING id",
          [email, profile.displayName]
        );

        const userId = newUser.rows[0].id;

        // Store account info
        await pool.query(
          `INSERT INTO accounts (user_id, provider, provider_id, provider_email, refresh_token)
           VALUES ($1, $2, $3, $4, $5,)`,
          [userId, "google", profile.id, email, refreshToken]
        );

        return done(null, { id: userId });
      } catch (error) {
        console.error("Google OAuth error:", error);
        return done(error, false);
      }
    }
  )
);

export default passport;