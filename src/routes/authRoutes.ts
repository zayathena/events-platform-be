import express, { Request, Response } from 'express';
import { createUser } from '../services/authService'; 
import { findUserByEmail, verifyPassword } from '../services/authService';

const router = express.Router(); 

router.post('/register', (req: Request, res: Response) => {
  const { email, password, role } = req.body;

  createUser(email, password, role)
    .then(user => res.status(201).json({ message: 'User created', user }))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Registration failed' });
    });
});

router.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  findUserByEmail(email)
    .then((user: any) => {
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      return verifyPassword(password, user.password)
        .then(isValid => {
          if (!isValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
          }

          (req.session as any).userId = user.id;

          res.json({
            message: 'Login successful',
            user: {
              id: user.id,
              email: user.email,
              role: user.role
            }
          });
        });
    })
    .catch((err: unknown) => {
      console.error(err);
      res.status(500).json({ error: 'Login failed' });
    });
});

export default router;

