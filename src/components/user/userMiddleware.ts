import { Role } from '@prisma/client'
import { Http as HttpStatus } from '@status/codes'
import { NextFunction, Request, Response } from 'express'
import { findUserById, findUsersByRole, findAllUsers } from './userModel'

export const getLoggedInUser = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  if (typeof request.user !== 'undefined') {
    const user = await findUserById(request.user.id)
    response.locals.data = user
    response.status(HttpStatus.Ok)
  } else {
    response.status(HttpStatus.NoContent)
  }
  next()
}

export const getUser = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
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

export const getAllUsers = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await findAllUsers()
    response.locals.data = user
    next()
  } catch (error) {
    request.log.info('error, calling next')
    return next(error)
  }
}

export const getUsersByRole = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const roleStr = request.params.role
    let role: Role
    switch (roleStr) {
      case 'sysAdmin':
        role = Role.SYSADMIN
        break
      case 'schoolAdmin':
        role = Role.SCHOOL_ADMIN
        break
      case 'schoolStaff':
        role = Role.SCHOOL_STAFF
        break
      case 'counselor':
        role = Role.COUNSELOR
        break
      case 'jovenAdmin':
        role = Role.JOVEN_ADMIN
        break
      case 'jovenStaff':
        role = Role.JOVEN_STAFF
        break
      case 'guardian':
        role = Role.GUARDIAN
        break
      case 'student':
        role = Role.STUDENT
        break
      default:
        throw new Error('Requested role does not exist.')
    }
    const users = await findUsersByRole(role)
    response.locals.data = users
    next()
  } catch (error) {
    request.log.info('error, calling next')
    return next(error)
  }
}

export const createUser = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  // TODO: Create user in database
  const user = {
    id: 2,
    name: 'Jake Smith'
  }
  response.locals.data = user
  next()
}
