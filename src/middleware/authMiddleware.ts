import { Request, Response, NextFunction } from 'express';


export function isStaff(req: any, res: any, next: any) {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.session.user.role !== 'staff') {
    return res.status(403).json({ error: 'Forbidden: Staff only' });
  }

  return next();
}

export function requireLogin(req: Request, res: Response, next: NextFunction) {
  const userId = (req.session as any)?.userId;

  if (!userId) {
    return res.status(401).json({ error: 'Not logged in' });
  }

  next();
}

