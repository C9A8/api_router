import pool from "../config/db";
import bcrypt from "bcrypt";
//import { generateAccessToken, generateRefreshToken } from "../utils/jwt";

// Register a new user
export const registerUserService = async (email: string, name: string, password: string) => {
  const client = await pool.connect();
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await client.query(
      `INSERT INTO users(email, name, password) 
       VALUES($1, $2, $3) 
       RETURNING id, email, name`,
      [email, name, hashedPassword]
    );

    return result.rows[0];
  } catch (error: any) {
    if (error.code === "23505") {
      throw new Error("Email already exists");
    }
    console.error("Error registering user:", error);
    throw new Error("Failed to register user");
  } finally {
    client.release();
  }
};

