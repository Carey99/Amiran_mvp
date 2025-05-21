import { Request, Response, NextFunction } from 'express';
import { storage } from '../storage'; // Adjust path if needed
import { User } from '../../shared/models/user';

// Authentication middleware
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Use session-based authentication
    const userId = req.session?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Find the user in the database
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach branch if instructor or branch_admin
    let branch = null;
    if (user.role === 'instructor' || user.role === 'super_admin') {
      const instructor = await storage.getInstructorByUserId(user.id);
      branch = instructor?.branch || null;
    }

    // Attach user and branch to request for downstream middleware and routes
    (req as any).user = { ...user.toObject(), branch };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ message: 'Authentication error', error: (error as Error).message });
  }
};

// Role-based authorization middleware
export const checkRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    
    if (!user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    if (!roles.includes(user.role)) {
      return res.status(403).json({ message: 'Access denied: insufficient permissions' });
    }
    
    next();
  };
};