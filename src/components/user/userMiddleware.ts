import { Role } from '@prisma/client'
import { Http as HttpStatus } from '@status/codes'
import { NextFunction, Request, Response } from 'express'
import {
  findUserById,
  findUsersByRole,
  findAllUsers,
  createUser,
  createCounselorRef
} from './userModel'

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
  const userId = request.params.id
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
    const user = await findAllUsers(request.user)
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
    const roleStr = request.params.role.toLowerCase()
    let role: Role
    switch (roleStr) {
      case 'sysadmin':
        role = Role.SYSADMIN
        break
      case 'schooladmin':
        role = Role.SCHOOL_ADMIN
        break
      case 'schoolstaff':
        role = Role.SCHOOL_STAFF
        break
      case 'counselor':
        role = Role.COUNSELOR
        break
      case 'jovenadmin':
        role = Role.JOVEN_ADMIN
        break
      case 'jovenstaff':
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
    const users = await findUsersByRole(request.user, role)
    response.locals.data = users
    next()
  } catch (error) {
    request.log.info('error, calling next')
    return next(error)
  }
}

export const createNewUser = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  const requestData = request.body
  const user = await createUser(requestData)
  if (typeof requestData.counselorRef !== undefined) {
    createCounselorRef(requestData, user.id)
  }
  response.locals.data = user
  next()
}
