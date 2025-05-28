import bcrypt from 'bcrypt';
import db from '../config/db/db';

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10); 
}

export function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function createUser(email: string, password: string, role: string) {
  return hashPassword(password).then(hashed => {
    return db.query(
      'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING *',
      [email, hashed, role]
    ).then(res => res.rows[0]);
  });
}

export function findUserByEmail(email: string) {
  return db.query('SELECT * FROM users WHERE email = $1', [email])
    .then(res => res.rows[0] || null);
}

export function verifyPassword(inputPassword: string, hashedPassword: string) {
  return bcrypt.compare(inputPassword, hashedPassword);
}