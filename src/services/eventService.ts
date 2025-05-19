import db from '../config/db'
import { QueryResult } from 'pg';

export function getAllEvents() {
  return db.query('SELECT * FROM events')
    .then((res: QueryResult) => res.rows);
}