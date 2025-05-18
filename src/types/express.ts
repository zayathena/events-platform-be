import session from 'express-session';

app.use(session({
  secret: process.env.SESSION_SECRET || 'some-secret',
  resave: false,
  saveUninitialized: false,
}));