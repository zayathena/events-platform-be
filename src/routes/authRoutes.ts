import express, { Request, Response } from 'express';
import { createUser } from '../services/authService'; 
import { findUserByEmail, verifyPassword } from '../services/authService';

const router = express.Router(); 

router.get('/', (req, res) => {
  res.send('Auth routes work');
});

router.post('/register', (req: Request, res: Response) => {
  const { email, password, role } = req.body;

  createUser(email, password, role)
    .then(user => res.status(201).json({ message: 'User created', user }))
    .catch(err => {
      console.error('Registration error:', err);
      res.status(500).json({ error: 'Registration failed' });
    });
});

router.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log(`Login attempt for: ${email}`);

  findUserByEmail(email)
    .then((user: any) => {
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

       console.log('User found:', user);

      return verifyPassword(password, user.password_hash)
        .then(isValid => {
          console.log('Password valid?', isValid);
          if (!isValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
          }

         (req.session as any).user = {
            id: user.id,
            email: user.email,
            role: user.role,
          };

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

router.get('/me', (req, res) => {
  const user = (req.session as any).user;
  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  res.json({
    id: user.id,
    email: user.email,
    role: user.role,
  });
});

export default router;

