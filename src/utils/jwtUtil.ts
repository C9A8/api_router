import {config}  from "../config/env";
import jwt from "jsonwebtoken";


//Access token 
export const generateAccessToken = (userId:string)=>{
    return jwt.sign({userId},config.accessToken,{expiresIn:"15m"});
}

//Refresh token
export const generateRefreshToken = (userId:string)=>{
    return jwt.sign({userId},config.refreshToken,{expiresIn:"1y"})
}

//Verify accesToken 
export const verifyAccesToken = (token:string)=>{
    return jwt.verify(token,config.accessToken) as {userId : string}
}


//Verify refreshToken
export const verifyRefreshToken = (token:string)=>{
    return jwt.verify(token,config.refreshToken) as {userId : string}
}