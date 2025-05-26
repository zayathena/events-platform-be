import express, { Request, Response } from 'express';
import { createUser } from '../services/authService'; 

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

export default router;

