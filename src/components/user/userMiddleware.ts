import { NextFunction, Request, Response } from 'express'
import { findUserById } from './userModel'

export const getUser = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  const userId = parseInt(request.params.id)
  try {
    const user = await findUserById(userId)
    response.locals.data = user
    next()
  } catch (error) {
    request.log.info('error, calling next')
    return next(error)
  }
}

export const createUser = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  // TODO: Create user in database
  const user = {
    id: 2,
    name: 'Jake Smith',
  }
  response.locals.data = user
  next()
}
