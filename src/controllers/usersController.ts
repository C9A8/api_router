import { Request, Response } from "express";
import { registerUsersSchema } from "../zod_schema/authSchema";
import { registerUserService} from "../services/authService";
import { json } from "zod";

export const registerUsers = async (req: Request, res: Response) => {
  const parsed = registerUsersSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ 
        message : "Invalid inputs",
        error: parsed.error.issues 
    });
  }

  try {
    const { email, name, password } = parsed.data;
    const user = await registerUserService(email, name, password);
    res.status(201).json({ user });
  } catch (error: any) {
    res.status(400).json({
         error: error.message, 
         message : "Something went wrong"
         
        });
  }
};

// export const loginUser = async (req: Request, res: Response) => {
//   const parsed = loginSchema.safeParse(req.body);
//   if (!parsed.success) {
//     return res.status(400).json({ error: parsed.error.flatten() });
//   }

//   try {
//     const { email, password } = parsed.data;
//     const { accessToken, refreshToken, user } = await loginUserService(email, password);
//     res.json({ accessToken, refreshToken, user });
//   } catch (error: any) {
//     res.status(401).json({ error: error.message });
//   }
// };


