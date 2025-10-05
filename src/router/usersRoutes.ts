import express from "express";
import {signInUsers, registerUsers, getInfo } from "../controllers/usersController";
import { verifyToken } from "../middleware/middleware";
import { refreshToken } from "../controllers/refreshToken";

export const userRoutes = express.Router();

//Signup user route
userRoutes.post("/signup",registerUsers);

//Signin user routes
userRoutes.post("/signin",signInUsers)

//refresh token routr
userRoutes.get("/refresh",refreshToken);
//protected route
userRoutes.get("/get",verifyToken,getInfo);