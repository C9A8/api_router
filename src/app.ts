import  express from "express";
import cors from "cors";
import { userRoutes } from "./router/usersRoutes";
import { addPasswordColumn } from "./db_schema/alterSchema";
const app = express();
app.use(cors());
app.use(express.json());

app.get("/",(req,res)=>{
    res.send("hello baby")
})

app.use("/api/v1",userRoutes);

export default app;