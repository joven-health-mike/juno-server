import { createUser, getUser } from './userMiddleware'
import { NextFunction, Request, Response } from 'express'

describe('UserMiddleware', () => {
  let request: Request
  let response: Response
  let mockNext: jest.Mock

  beforeEach(() => {
    request = {} as unknown as Request
    response = { locals: {} } as unknown as Response
    mockNext = jest.fn()
  })

  afterEach(() => {
    mockNext.mockReset()
  })

  describe('getUser', () => {
    it('should ', () => {
      getUser(request, response, mockNext)
      expect(mockNext).toHaveBeenCalledTimes(1)
      expect(response.locals.data).toEqual({ id: 1, name: 'Jon Smith' })
    })
  })

  describe('createUser', () => {
    it('should ', () => {
      createUser(request, response, mockNext)
      expect(mockNext).toHaveBeenCalledTimes(1)
      expect(response.locals.data).toEqual({ id: 2, name: 'Jake Smith' })
    })
  })
})