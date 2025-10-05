import { generateAccessToken, verifyRefreshToken } from "../utils/jwtUtil"

import { Request, Response } from "express";

export const refreshToken = async (req : Request , res : Response)=>{
    try{
        const token = req.cookies.refreshToken;
        const verifyPayload = verifyRefreshToken(token);
        if(!verifyPayload){
            return res.status(401).json({
                message : "Invalid resfresh token or may expires"
            });
        }

        // Generating new accessToken from refresh token 
        console.log(verifyPayload.userId)
        const newAccessToken  = generateAccessToken(verifyPayload.userId);
        res.status(200).json({
            message : "New accesstoken created successfully",
            newAccessToken
        });


    }catch(error){
        res.status(500).json({message : "Failed to create new accesstoken",error})
    }
}