import { Request, Response } from "express";
import { loginUsersSchema, registerUsersSchema } from "../zod_schema/authSchema";
import { loginUsersService, registerUserService} from "../services/authService";



//Signup user funtion
export const registerUsers = async (req: Request, res: Response) => {
  const parsed = registerUsersSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ 
        message : "Invalid inputs",
        error: parsed.error.issues 
    });
  }
  console.log(parsed.data.email,parsed.data.name);

  try {
    const { email, name, password } = parsed.data;
     
    const user = await registerUserService(email, name, password);
    res.status(201).json({ 
      message : "User created please login",
      user   : user 
          
     });
  } catch (error: any) {
    res.status(400).json({
         error: error.message, 
         message : "Something went wrong"
         });
  }
};


//Signin user function

export const signInUsers = async (req: Request, res: Response) => {
  //  Validate inputs
  const parsed = loginUsersSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid inputs",
      error: parsed.error.issues,
    });
  }

  try {
    const { email, password } = parsed.data;
    const result = await loginUsersService(email, password);

    if (!result.success) {
      return res.status(400).json({
        message: "SignIn failed",
        error: result.message,
      });
    }

    //  Generate tokens
    // const accessToken = generateAccessToken(result.user?.id);
    // const refreshToken = generateRefreshToken(result.user?.id);

    //store refresh token in cookie

    res.cookie('refreshToken', result.refreshToken, {
       httpOnly: true,
       secure: process.env.NODE_ENV === 'production',
       sameSite: 'strict',
       maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days max
    });

    // Respond to client
    return res.status(200).json({
      message      : "SignIn successful",
      accessToken  : result.accessToken,
    });

  } catch (error: any) {
    return res.status(500).json({
      message: "Failed to signin",
      error: error.message,
    });
  }
};


//protected 

export const getInfo = async (req: Request, res: Response)=>{
  res.send("hello baby ")
}