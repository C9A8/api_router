import dotenv from "dotenv"
dotenv.config();

 type  Config = {
    port         : string | Number;    
    dburl        : string; 
    openaiKey    : string;  
    antrophiKey  : string;
    geminiakey   : string;
    accessToken  : string;
    refreshToken : string;

}

export const config:Config = {
    port         : process.env.PORT || "",
    dburl        : process.env.DATABASE_URL ||"",
    openaiKey    : process.env.OPEN_API_KEY || "" ,     
    antrophiKey  : process.env.ANTROPHIC_API_KEY || "",
    geminiakey   : process.env.GEMINI_API_KEY || "",
    accessToken  : process.env.ACCESS_TOKEN_SECRET_KET || "",
    refreshToken : process.env.REFRESH_TOKEN_SECRET_KEY || "",
}