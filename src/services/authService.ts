import pool from "../config/db";
import bcrypt from "bcrypt";

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
    // Find the user by email
    const result = await client.query(
      'SELECT id,email, password FROM users WHERE email = $1',
      [email]
    );

    // Check if user exists
    if (result.rows.length === 0) {
      return { success: false, message: 'User not found' };
    }

    const user = result.rows[0];

    // Compare password with bcrypt
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return { success: false, message: 'Invalid password' };
    }

    return {
      success: true,
      message: 'Login successful',
      user   : { id: user.id },
    };

  } catch (error: any) {
    throw new Error(`Failed to login: ${error.message}`);
  } finally {
    client.release();
  }
};