import { Request, Response, NextFunction } from 'express';
import jwt, { VerifyErrors } from 'jsonwebtoken';

interface UserPayload {
  id: string;
  role: string;
  is_verified: boolean;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'Access denied' });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err:VerifyErrors | null, user: any) => {
    if (err) {
      res.status(403).json({ message: 'Invalid token' });
      return;
    }
    req.user = user as UserPayload;
    next();
  });
};

export const restrictToAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ message: 'Admin access required' });
    return;
  }
  next();
};

export const requireVerification = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user || !req.user.is_verified) {
    res.status(403).json({ message: 'Email not verified' });
    return;
  }
  next();
};