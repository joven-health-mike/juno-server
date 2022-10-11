import { createAppointment, getAppointment } from '../appointmentMiddleware'
import { Request, Response } from 'express'
import {
  mockAppointment,
  findAppointmentById
} from '../__mocks__/appointmentModel'

jest.mock('../appointmentModel')

describe('AppointmentMiddleware', () => {
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

  describe('getAppointment', () => {
    it('should ', async () => {
      request.params.id = '22'
      await getAppointment(request, response, mockNext)
      expect(mockNext).toHaveBeenCalledTimes(1)
      // expect(findUserById).toHaveBeenCalledWith(22)
      expect(response.locals.data).toEqual(mockAppointment)
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
