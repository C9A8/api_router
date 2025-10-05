import  express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { userRoutes } from "./router/usersRoutes";

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser()); 

app.get("/",(req,res)=>{
    res.send("hello baby")
})

app.use("/api/v1",userRoutes);

export default app;