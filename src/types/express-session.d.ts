import 'express-session';

declare module 'express-session' {
  interface SessionData {
    user?: {
      id: number;
      role: string;
      [key: string]: any;
    };
    tokens?: any;
  }
}