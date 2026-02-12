import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

export const isUser = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'user' && req.user?.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. User role required.'
    });
  }
  next();
};

export const isWorker = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'worker' && req.user?.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Worker role required.'
    });
  }
  next();
};

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin role required.'
    });
  }
  
  // Additional email check for admin
  if (req.user.email !== process.env.ADMIN_EMAIL) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Not authorized admin.'
    });
  }
  
  next();
};
