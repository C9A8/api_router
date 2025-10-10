import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { config } from "../config/env";
import pool from "./db"; 
import { generateRefreshToken } from "../utils/jwtUtil";

passport.use(
  new GoogleStrategy(
    {
      clientID: config.googleClientId,
      clientSecret: config.googleClientSecret,
      callbackURL: config.callback,
    },
    async (accessToken, googleRefreshToken, profile, done) => {
      const client = await pool.connect();
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(new Error("No email in Google profile"), false);

        // Check if account exists
        const existingAccount = await client.query(
          "SELECT * FROM accounts WHERE provider = $1 AND provider_id = $2",
          ["google", profile.id]
        );

        let userId: string;

        if (existingAccount.rows.length > 0) {
          // Existing user
          userId = existingAccount.rows[0].user_id;

          // Always generate a new refresh token for sessions
          const sessionToken = generateRefreshToken(userId);
          const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

          await client.query(
            `INSERT INTO sessions (user_id, token, expires_at)
             VALUES ($1, $2, $3)`,
            [userId, sessionToken, expiresAt]
          );

          return done(null, { id: userId, sessionToken });
        }

        // Create new user
        const newUser = await client.query(
          "INSERT INTO users (email, name) VALUES ($1, $2) RETURNING id",
          [email, profile.displayName]
        );

        userId = newUser.rows[0].id;

        // Store account info (Google refresh token)
        await client.query(
          `INSERT INTO accounts (user_id, provider, provider_id, provider_email, refresh_token)
           VALUES ($1, $2, $3, $4, $5)`,
          [userId, "google", profile.id, email, googleRefreshToken]
        );

        // Generate your own refresh token for session
        const sessionToken = generateRefreshToken(userId);
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        await client.query(
          `INSERT INTO sessions (user_id, token, expires_at)
           VALUES ($1, $2, $3)`,
          [userId, sessionToken, expiresAt]
        );

        return done(null, { id: userId, sessionToken });
      } catch (error) {
        console.error("Google OAuth error:", error);
        return done(error, false);
      } finally {
        client.release();
      }
    }
  )
);

export default passport;

