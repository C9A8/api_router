import express from "express";
import passport from "../config/googleAuth";
import { generateAccessToken, generateRefreshToken } from "../utils/jwtUtil";

const authRouter = express.Router();

// Redirect to Google
authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google callback
authRouter.get(
  "/google/callback",
  passport.authenticate("google", { 
    session: false,
    accessType: "offline",
    prompt: "consent", }),
  (req, res) => {
    const user = req.user as { id: string };

    // Issue JWT tokens
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    //store refresh token in cookies
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: "Google login successful",
      accessToken,
    });
  }
);

export default authRouter;
