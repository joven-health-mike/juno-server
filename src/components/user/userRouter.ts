import express from 'express'
import {ensureUserIsAuthenticated} from '../permissions/permissionsMiddleware'
import {createUser, getUser} from './userMiddleware'

export const userRouter = express.Router()

userRouter.get('/api/1/user', getUser)

userRouter.put('/api/1/user', ensureUserIsAuthenticated, createUser)
