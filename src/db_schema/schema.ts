import pool from "../config/db"

// Main table for users 
const usersTable = async ()=>{
    const client = await pool.connect();
    try{
        await client.query(`
            CREATE TABLE IF NOT EXISTS users(
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            email VARCHAR(100) UNIQUE NOT NULL,
            name VARCHAR(100),
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
            )`)
            console.log("Users table created ");
    }catch(error){
        console.log(`Failed to create usersTable ${error}`)
    }finally{
        client.release();
    }
}


// Account table for tracking the providers

const accountTable = async ()=>{
    const client = await pool.connect();
    try{
        await client.query(`
            CREATE TABLE IF NOT EXISTS accounts(
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            provider VARCHAR(100) NOT NULL,
            provider_id VARCHAR(100) NOT NULL,
            provider_email VARCHAR(100),
            refresh_token TEXT,
            expire_at  TIMESTAMPTZ,
            created_at TIMESTAMPTZ  DEFAULT NOW(),
            updated_at TIMESTAMPTZ  DEFAULT NOW(),
            CONSTRAINT unique_provider UNIQUE (provider,provider_id)
            )`)
            console.log("Accounts table created")
    }catch(error){
        console.log("Failed to create accounts table",error)
    }finally{
        client.release();
    }
}

//Session table keep track of in how many device user login

const sessionsTable = async ()=>{
    const client = await pool.connect();
    try{
        await client.query(`
            CREATE TABLE IF NOT EXISTS sessions(
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            token TEXT NOT NULL UNIQUE,
            expires_at TIMESTAMPTZ,
            created_at TIMESTAMPTZ DEFAULT NOW()
            )`)
            console.log("Session table created")
    }catch(error){
        console.log("Failed to create session table",error)
    }finally{
        client.release();
    }
}

//ai_request tabele which store the core logic data


const ai_requestTable = async()=>{
    const client = await pool.connect();
    try{
        await client.query(`
            CREATE TABLE IF NOT EXISTS ai_requests(
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            prompt TEXT NOT NULL,
            model_used VARCHAR(100) NOT NULL,
            response TEXT,
            cost NUMERIC(10,4) NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW()
             )`)
            console.log("Ai_request table created")
    }catch(error){
        console.log("Failed to create ai_request table",error)
    }finally{
        client.release();
    }
}


//Final schema 

export const finalSchema = async()=>{
    await pool.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);
    console.log("pgcrypto extension is ready");

     await usersTable();
     await accountTable();
     await sessionsTable();
     await ai_requestTable();
     console.log("All table are created successfully")
     await pool.end();
}



