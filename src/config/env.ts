import dotenv from "dotenv"
dotenv.config();

 type  Config = {
    port               : string | number;    
    dburl              : string; 
    openaiKey          : string;  
    antrophiKey        : string;
    geminiakey         : string;
    accessToken        : string;
    refreshToken       : string;
    googleClientId     : string;
    googleClientSecret : string;
    callback           : string;

}

export const config:Config = {
    port               : process.env.PORT || "",
    dburl              : process.env.DATABASE_URL ||"",
    openaiKey          : process.env.OPEN_API_KEY || "" ,     
    antrophiKey        : process.env.ANTROPHIC_API_KEY || "",
    geminiakey         : process.env.GEMINI_API_KEY || "",
    accessToken        : process.env.ACCESS_TOKEN_SECRET_KET || "",
    refreshToken       : process.env.REFRESH_TOKEN_SECRET_KEY || "",
    googleClientId     : process.env.GOOGLE_CLIENT_ID || "",
    googleClientSecret : process.env.GOOGLE_CLIENT_SECRET || "",
    callback           : process.env.GOOGLE_REDIRECT_URI || "",

}