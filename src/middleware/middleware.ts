import { Request, Response, NextFunction } from 'express';
import { verifyAccesToken } from '../utils/jwtUtil';

// Extend Request type to include 'user' in TypeScript
declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'] || "";
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Token missing' });
  }

  try {
    const payload = verifyAccesToken(token); // Should return the decoded JWT payload
    req.user = { id: payload.userId }; // attach user info to request
    next(); // continue to route
  } catch (error: any) {
    return res.status(403).json({ message: 'Forbidden: Invalid or expired token' });
  }
};
