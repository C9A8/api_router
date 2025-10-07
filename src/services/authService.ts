import { success } from "zod";
import pool from "../config/db";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../utils/jwtUtil";

// Register a new user
export const registerUserService = async (email: string , name: string , password: string) => {
  const client = await pool.connect();
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await client.query(
      `INSERT INTO users(email, name, password) 
       VALUES($1, $2, $3) 
       RETURNING id, email, name`,
      [email, name, hashedPassword]
    );

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

//Signin user
export const loginUsersService = async (email: string, password: string) => {
  const client = await pool.connect();
  try {
    const result = await client.query(`SELECT id, email, password FROM users WHERE email = $1`, [email]);
    //Checking user exits or not
    if (result.rows.length === 0) 
    return { success: false, message: "User not found" };

    const user = result.rows[0];

    //Checking for passwerd
    if(!password && password.length < 6)
      return { success : false, message : "Password is require"}

    //Checking for correct password
    const match = await bcrypt.compare(password, user.password);
    if (!match) return { success: false, message: "Invalid password" };

    // Generate tokens
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Upsert account table
    const existingAccount = await client.query(
      `SELECT * FROM accounts WHERE user_id = $1 AND provider = $2`,
      [user.id, "local"]
    );

    if (existingAccount.rows.length === 0) {
      await client.query(
        `INSERT INTO accounts (user_id, provider, provider_id, provider_email, refresh_token)
         VALUES ($1, $2, $3, $4, $5)`,
        [user.id, "local", user.email, user.email, refreshToken]
      );
    } else {
      await client.query(
        `UPDATE accounts SET refresh_token = $1, updated_at = NOW() 
         WHERE user_id = $2 AND provider = 'local'`,
        [refreshToken, user.id]
      );
    }

    return { success: true, user: { id: user.id }, accessToken, refreshToken };
  } finally {
    client.release();
  }
};
