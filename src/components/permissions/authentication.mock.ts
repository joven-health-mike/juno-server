import {NextFunction} from 'express'

export const mockAuthenticateAuth0 = jest.fn((req: Request, res: Response, next: NextFunction) => next())

const MockAuthentication = {
  authenticateAuth0: mockAuthenticateAuth0,
}

export default MockAuthentication
