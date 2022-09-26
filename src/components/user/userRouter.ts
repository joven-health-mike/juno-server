import express from 'express'
import { ensureUserIsAuthenticated } from '../permissions/permissionsMiddleware'
import {
  createUser,
  getUser,
  getUsersByRole,
  getAllUsers,
  getLoggedInUser
} from './userMiddleware'

export const userRouter = express.Router()

userRouter.get('/api/1/loggedInUser', getLoggedInUser)
userRouter.get('/api/1/users/', ensureUserIsAuthenticated, getAllUsers)
userRouter.get('/api/1/users/:id', ensureUserIsAuthenticated, getUser)
userRouter.get(
  '/api/1/users/role/:role',
  ensureUserIsAuthenticated,
  getUsersByRole
)
userRouter.put('/api/1/users', ensureUserIsAuthenticated, createUser)
