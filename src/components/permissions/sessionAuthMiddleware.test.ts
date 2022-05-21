import {Request, Response, NextFunction} from 'express'
import {authenticateSession} from './sessionAuthMiddleware'

describe('SessionAuthMiddleware', () => {
  let header: jest.Mock
  let next: NextFunction
  let res: Response
  let req: Request

  beforeEach(() => {
    next = jest.fn()
    header = jest.fn().mockImplementation(() => undefined)
    req = ({
      body: {},
      header,
    } as unknown) as Request
    res = ({send: jest.fn(), status: jest.fn()} as unknown) as Response
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('authenticateSession', () => {
    it('should not attempt to authenticate a request missing the Authorization header', async () => {
      await authenticateSession(req, res, next)
      expect(next).toHaveBeenCalled()
    })
  })
})
