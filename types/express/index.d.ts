// Application Specific Typescript definitions for Express
// This file defines typescript definitions that are specific to the application and the Express types.

import { Response as CoreResponse } from 'express-serve-static-core'
import { Logger } from 'pino'
import { M2mAuth } from '../../src/components/permissions/m2mAuthMiddleware'

// The Express response object has a locals property used to store variables 
// that should be accessible to the templates rendered with res.render. The 
// variables set on res.locals are available within a single request-response 
// cycle, and will not be shared between requests. ResponseLocals defines type
// specific information our application stores in the res.locals object.
interface ResponseLocals {
  // Stores information that the response handler will return to the client.
  data?: unknown;
}

// Adds the project's custom Request and Response types to the Express application.
declare module 'Express' {
  interface Request {
    // When true, the client is authenticated
    authenticated: boolean;
    // Unique identifier for the request
    id: string;
    // Unique identifier for the request that allows the request to made 
    // twice (or more) without performing the requested operation twice.
    idempotencyKey: string | undefined;
    // Instance of the logger to be used by the request to make logs for
    // each request easier to trace.
    log: Logger;
    // Machine-to-Machine authentication information, returned from Auth0.
    m2mAuth: M2mAuth | undefined;
    // The authenticated user's information.
    user: object | undefined;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export interface Response<ResBody = any, Locals extends Record<string, any> = Record<string, any>> extends CoreResponse<ResBody, Locals> {
    // Add's our strongly typed ResponseLocals to the Express res.locals object. 
    locals: ResponseLocals & Locals;
  }
}

// The Request object must be duplicated in the 'express-serve-static-core' to ensure this builds in 
// all operating systems, specifically the Docker container.
declare module 'express-serve-static-core' {
  interface Request {
    authenticated: boolean;
    id: string;
    idempotencyKey: string | undefined;
    log: Logger;
    m2mAuth: M2mAuth | undefined;
    user: object | undefined;
  }
}
