import { Logger } from 'pino'
import { JwtUser, M2mAuth } from '../../src/components/permissions/m2mAuthMiddleware'

declare module 'Express' {
  interface Request {
    authenticated: boolean;
    id: string;
    idempotencyKey: string | undefined;
    log: Logger;
    jwtUser: JwtUser | undefined;
    m2mAuth: M2mAuth | undefined;
    user: object | undefined;
  }

  interface Response {
    locals: {
      data: unknown;
    };
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    authenticated: boolean;
    id: string;
    idempotencyKey: string | undefined;
    log: Logger;
    jwtUser: JwtUser | undefined;
    m2mAuth: M2mAuth | undefined;
    user: object | undefined;
  }

  interface Response {
    // TODO: Change to locals, with a lowercase 'l'?
    Locals: {
      data: unknown;
    };
  }
}
