import express from 'express'
import {ensureUserIsAuthenticated} from '../permissions/permissionsMiddleware'
import {createUser, getUser} from './userMiddleware'

export const userRouter = express.Router()

// TODO: Remove later
userRouter.get('/', ensureUserIsAuthenticated, getUser)
userRouter.get('/api/1/user', ensureUserIsAuthenticated, getUser)

userRouter.put('/api/1/user', ensureUserIsAuthenticated, createUser)
