import { createUser, getUser } from '../userMiddleware'
import { Request, Response } from 'express'
import { mockUser, findUserById} from '../__mocks__/userModel'

jest.mock('../userModel')

describe('UserMiddleware', () => {
  let request: Request
  let response: Response
  let mockNext: jest.Mock

  beforeEach(() => {
    request = {
      params: {}
    } as unknown as Request
    response = { locals: {} } as unknown as Response
    mockNext = jest.fn()
  })

  afterEach(() => {
    // mockNext.mockReset()
  })

  describe('getUser', () => {
    it('should ', async () => {
      request.params.id = '22'
      await getUser(request, response, mockNext)
      expect(mockNext).toHaveBeenCalledTimes(1)
      // expect(findUserById).toHaveBeenCalledWith(22)
      expect(response.locals.data).toEqual(mockUser)
    })
  })

  // describe('createUser', () => {
  //   it('should ', () => {
  //     createUser(request, response, mockNext)
  //     expect(mockNext).toHaveBeenCalledTimes(1)
  //     expect(response.locals.data).toEqual({ id: 2, name: 'Jake Smith' })
  //   })
  // })
})