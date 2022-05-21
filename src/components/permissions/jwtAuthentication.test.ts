import {Request, Response, NextFunction} from 'express'
import {authenticateAuth0} from './authentication'

describe('AuthMiddleware', () => {
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

  describe('authenticateAuth0', () => {
    it('should not attempt to authenticate a request missing the Authorization header', async () => {
      await authenticateAuth0(req, res, next)
      expect(next).toHaveBeenCalled()
    })
  })
})
