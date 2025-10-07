import pool from "../config/db"

export const addPasswordColumn = async () => {
    const client = await pool.connect();
    try {
        // 1. Add column (nullable for now)
        await client.query(`
            ALTER TABLE users
            ADD COLUMN IF NOT EXISTS password TEXT;
        `);

        // 2. Fill existing rows with a temporary password
        await client.query(`
            UPDATE users
            SET password = 'temp@123'
            WHERE password IS NULL;
        `);

        // 3. Enforce NOT NULL
        await client.query(`
            ALTER TABLE users
            ALTER COLUMN password SET NOT NULL;
        `);

        // 4. Add length constraint
        await client.query(`
            ALTER TABLE users
            ADD CONSTRAINT password_length_check 
            CHECK (char_length(password) >= 8 AND char_length(password) <= 64);
        `);

        console.log("Password column added successfully");
    } catch (error) {
        console.error("Failed to add password column", error);
    } finally {
        client.release();
    }
}

// (async()=>{
//     await addPasswordColumn();
// })()


//reset password to nullable
export const setPasswordToNull = async()=>{
    const client = await pool.connect();
    client.query(`
        ALTER TABLE users 
        ALTER COLUMN password 
        DROP NOT NULL;
`);
console.log("done");
}

// remove accesstoken column from db
export const dropAccessToken = async()=>{
    const client = await pool.connect();
    client.query(`
        ALTER TABLE accounts 
        DROP COLUMN access_token;
        `);
console.log("done");
}


