import express from 'express'
import { ensureUserIsAuthenticated } from '../permissions/permissionsMiddleware'
import {
  createNewUser,
  getUser,
  getUsersByRole,
  getAllUsers,
  getLoggedInUser,
  updateExistingUser,
  deleteExistingUser
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
userRouter.post('/api/1/users', ensureUserIsAuthenticated, createNewUser)
userRouter.put(
  '/api/1/users/:id',
  ensureUserIsAuthenticated,
  updateExistingUser
)
userRouter.delete(
  '/api/1/users/:id',
  ensureUserIsAuthenticated,
  deleteExistingUser
)
