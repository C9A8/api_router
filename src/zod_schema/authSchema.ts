import {z} from "zod";

//To validate users json comes from frontend
export const registerUsersSchema = z.object({
    email : z.email("Email must be valid"),
    name : z.string().min(5).max(100,"Name must be less than 100 characters"),
    password : z.string().min(8).max(64)
})