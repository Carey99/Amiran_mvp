import { Request, Response, NextFunction } from 'express';
import { User } from '../../shared/models/user';

// Authentication middleware
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // For our simple implementation, we'll check if the user exists
    // In a real application, this would check session tokens, JWT, etc.
    
    // Get the authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // Extract userId (this would typically be a token)
    const userId = authHeader.split(' ')[1];
    
    if (!userId) {
      return res.status(401).json({ message: 'Invalid authentication format' });
    }
    
    // Find the user in the database
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    // Attach user to request for downstream middleware and routes
    (req as any).user = user;
    
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