import express from 'express'
import { ensureUserIsAuthenticated } from '../permissions/permissionsMiddleware'
import {
  createNewSchool,
  getSchool,
  getAllSchools,
  updateExistingSchool,
  deleteExistingSchool
} from './schoolMiddleware'

export const schoolRouter = express.Router()

schoolRouter.get('/api/1/schools/', ensureUserIsAuthenticated, getAllSchools)
schoolRouter.get('/api/1/schools/:id', ensureUserIsAuthenticated, getSchool)
schoolRouter.post('/api/1/schools', ensureUserIsAuthenticated, createNewSchool)
schoolRouter.put(
  '/api/1/schools/:id',
  ensureUserIsAuthenticated,
  updateExistingSchool
)
schoolRouter.delete(
  '/api/1/schools/:id',
  ensureUserIsAuthenticated,
  deleteExistingSchool
)
