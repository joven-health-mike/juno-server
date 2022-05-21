import { Logger } from 'pino'
import { JwtUser } from '../../src/components/permissions/authentication'

declare module 'Express' {
  interface Request {
    authenticated: boolean;
    id: string;
    idempotencyKey: string | undefined;
    log: Logger;
    jwtUser: JwtUser | undefined;
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
    user: object | undefined;
  }

  interface Response {
    locals: {
      data: unknown;
    };
  }
}
