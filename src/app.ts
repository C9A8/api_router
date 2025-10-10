import  express from "express";
import cors from "cors";
import passport from "./config/googleAuth";
import cookieParser from "cookie-parser";
import { userRoutes } from "./router/usersRoutes";
import authRouter from "./router/authRouter";

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser()); 
app.use("/api/auth",authRouter);


app.get("/",(req,res)=>{
    res.send("hello baby")
})

app.use("/api/v1",userRoutes);

export default app;