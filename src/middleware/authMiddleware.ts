import { Request, Response, NextFunction } from 'express';

export function requireLogin(req: Request, res: Response, next: NextFunction
): void {
  if (!req.session || !req.session.user || !req.session.user.id) {
    res.status(401).json({ error: 'Not logged in' });
    return; 
  }
  next();
}

export function isStaff(req: Request, res: Response, next: NextFunction
): void {
  if (!req.session || !req.session.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  if (req.session.user.role !== 'staff') {
    res.status(403).json({ error: 'Forbidden: Staff only' });
    return;
  }

  next();
}

export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (req.session && req.session.user) {
    next();
    return;
  }
  res.status(401).json({ message: 'Unauthorized' });
}