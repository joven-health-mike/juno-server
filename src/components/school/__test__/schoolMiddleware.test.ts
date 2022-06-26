import { getSchool } from '../schoolMiddleware'
import { Request, Response } from 'express'
import { mockSchool } from '../__mocks__/schoolModel'

jest.mock('../schoolModel')

describe('SchoolMiddleware', () => {
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

  describe('getSchool', () => {
    it('should ', async () => {
      request.params.id = '22'
      await getSchool(request, response, mockNext)
      expect(mockNext).toHaveBeenCalledTimes(1)
      // expect(findUserById).toHaveBeenCalledWith(22)
      expect(response.locals.data).toEqual(mockSchool)
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
