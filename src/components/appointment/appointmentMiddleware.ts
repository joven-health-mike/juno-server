import { User } from '@prisma/client'
import { NextFunction, Request, Response } from 'express'
import {
  createAppointment,
  findAllAppointments,
  findAppointmentById
} from './appointmentModel'

export const getAllAppointments = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const appointments = await findAllAppointments(request.user as User)
    response.locals.data = appointments
    next()
  } catch (error) {
    request.log.info('error, calling next')
    return next(error)
  }
}

export const getAppointment = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  const appointmentId = request.params.id
  try {
    const appointment = await findAppointmentById(appointmentId)
    response.locals.data = appointment
    next()
  } catch (error) {
    request.log.info('error, calling next')
    return next(error)
  }
}

export const createNewAppointment = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  const requestData = request.body
  const appointment = await createAppointment(requestData)
  response.locals.data = appointment
  next()
}
