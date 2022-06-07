import { NextFunction, Request, Response } from 'express'
import { findAppointmentById } from './appointmentModel'

export const getAppointment = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  const appointmentId = parseInt(request.params.id)
  try {
    const appointment = await findAppointmentById(appointmentId)
    response.locals.data = appointment
    next()
  } catch (error) {
    request.log.info('error, calling next')
    return next(error)
  }
}

export const createAppointment = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  // TODO: Create appointment in database
  const appointment = {
    id: 2,
    title: 'Jake Smith',
    start: '2022-06-06',
    end: '2022-06-06',
    studentId: 0,
    counselorId: 0
  }
  response.locals.data = appointment
  next()
}
