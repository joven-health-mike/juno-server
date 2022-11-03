import express from 'express'
import { ensureUserIsAuthenticated } from '../permissions/permissionsMiddleware'
import {
  createNewAppointment,
  deleteExistingAppointment,
  getAllAppointments,
  getAppointment,
  updateExistingAppointment
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

appointmentRouter.post(
  '/api/1/appointments',
  ensureUserIsAuthenticated,
  createNewAppointment
)

appointmentRouter.put(
  '/api/1/appointments/:id',
  ensureUserIsAuthenticated,
  updateExistingAppointment
)

appointmentRouter.delete(
  '/api/1/appointments/:id',
  ensureUserIsAuthenticated,
  deleteExistingAppointment
)
