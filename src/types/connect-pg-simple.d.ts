declare module 'connect-pg-simple' {
  import session from 'express-session';

  class PgSession extends session.Store {
    constructor(options?: any);
  }

  export = PgSession;
}