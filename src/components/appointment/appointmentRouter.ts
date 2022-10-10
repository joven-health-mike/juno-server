import express from 'express'
import { ensureUserIsAuthenticated } from '../permissions/permissionsMiddleware'
import {
  createNewAppointment,
  getAllAppointments,
  getAppointment
} from './appointmentMiddleware'

export const appointmentRouter = express.Router()

appointmentRouter.get(
  '/api/1/appointments/',
  ensureUserIsAuthenticated,
  getAllAppointments
)

appointmentRouter.get(
  '/api/1/appointments/:id',
  ensureUserIsAuthenticated,
  getAppointment
)

appointmentRouter.put(
  '/api/1/appointments',
  ensureUserIsAuthenticated,
  createNewAppointment
)

appointmentRouter.post(
  '/api/1/appointments',
  ensureUserIsAuthenticated,
  createNewAppointment
)
