import express from "express";
import {registerUsers } from "../controllers/usersController";

export const userRoutes = express.Router();


userRoutes.post("/registerUsers",registerUsers);
// userRoutes.get("/users")