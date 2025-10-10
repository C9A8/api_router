import { Request, Response } from "express";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwtUtil";
import pool from "../config/db";

export const refreshToken = async (req: Request, res: Response) => {
  const client = await pool.connect();

  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({ message: "Refresh token missing" });
    }

    const verifyPayload = verifyRefreshToken(token);
    if (!verifyPayload) {
      return res.status(401).json({ message: "Invalid or expired refresh token" });
    }

    const userId = verifyPayload.userId;

    // Verify session in DB
    const result = await client.query(
      `SELECT * FROM sessions WHERE user_id = $1 AND token = $2`,
      [userId, token]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ message: "Session not found" });
    }

    const session = result.rows[0];
    if (new Date(session.expires_at) < new Date()) {
      await client.query(`DELETE FROM sessions WHERE id = $1`, [session.id]);
      return res.status(401).json({ message: "Session expired. Please log in again." });
    }

    // Rotate tokens
    const newAccessToken = generateAccessToken(userId);
    const newRefreshToken = generateRefreshToken(userId);
    const newExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await client.query(
      `UPDATE sessions SET token = $1, expires_at = $2 WHERE id = $3`,
      [newRefreshToken, newExpiry, session.id]
    );

    // Set new cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "New tokens generated successfully",
      accessToken: newAccessToken,
    });

  } catch (error) {
    console.error("Error refreshing token:", error);
    return res.status(500).json({ message: "Failed to refresh token", error });
  } finally {
    client.release();
  }
};
