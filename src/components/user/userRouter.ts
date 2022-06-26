import express from 'express'
import { ensureUserIsAuthenticated } from '../permissions/permissionsMiddleware'
import { createUser, getUser, getUsersByRole } from './userMiddleware'

export const userRouter = express.Router()

userRouter.get('/api/1/users/:id', ensureUserIsAuthenticated, getUser)
userRouter.get(
  '/api/1/users/role/:role',
  ensureUserIsAuthenticated,
  getUsersByRole
)
userRouter.put('/api/1/users', ensureUserIsAuthenticated, createUser)
