import { NextFunction, Request, Response } from 'express'
import { DetailedUser } from '../user/userModel'
import {
  createAppointment,
  createRecurringAppointments,
  deleteAppointment,
  findAllAppointments,
  findAppointmentById,
  updateAppointment
} from './appointmentModel'

export const getAllAppointments = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const appointments = await findAllAppointments(request.user as DetailedUser)
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
  const appointments = []
  const appointment = await createAppointment(requestData)
  appointments.push(appointment)
  if (appointment.isRecurring) {
    const recurringAppointments = await createRecurringAppointments(
      requestData,
      appointment
    )
    appointments.push(...recurringAppointments)
  }
  response.locals.data = appointments
  next()
}

export const updateExistingAppointment = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  const requestData = request.body
  const urlParamId = request.params.id
  if (urlParamId === requestData.id) {
    const appointment = await updateAppointment(requestData)
    response.locals.data = appointment
  } else {
    // TODO: ID of the passed-in object didn't match ID of the URL
  }
  next()
}

export const deleteExistingAppointment = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  const appointmentIdToDelete = request.params.id
  const appointment = await deleteAppointment(appointmentIdToDelete)
  response.locals.data = appointment
  next()
}
