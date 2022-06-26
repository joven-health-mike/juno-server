import express from 'express'
import { ensureUserIsAuthenticated } from '../permissions/permissionsMiddleware'
import { createSchool, getSchool } from './schoolMiddleware'

export const schoolRouter = express.Router()

schoolRouter.get('/api/1/schools/:id', ensureUserIsAuthenticated, getSchool)
schoolRouter.put('/api/1/schools', ensureUserIsAuthenticated, createSchool)
