import { Request, Response, NextFunction } from 'express';

export function requireLogin(req: Request, res: Response, next: NextFunction) {
  if (!req.session || !req.session.user || !req.session.user.id) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  next();
}

export function isStaff(req: Request, res: Response, next: NextFunction) {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.session.user.role !== 'staff') {
    return res.status(403).json({ error: 'Forbidden: Staff only' });
  }

  return next();
}

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.session && req.session.user) {
    return next();
  }

  return res.status(401).json({ message: 'Unauthorized' });
}