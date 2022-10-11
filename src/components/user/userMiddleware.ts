import { Role, User } from '@prisma/client'
import { Http as HttpStatus } from '@status/codes'
import { NextFunction, Request, Response } from 'express'
import {
  findUserById,
  findUsersByRole,
  findAllUsers,
  createUser,
  createCounselorRef,
  findUserByUsername,
  createSchoolAdminRef,
  createSchoolStaffRef,
  createStudentRef
} from './userModel'

export const getLoggedInUser = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  if (typeof request.user !== 'undefined') {
    const user = await findUserByUsername((request.user as User).username)
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
    const user = await findAllUsers(request.user as User)
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
    const users = await findUsersByRole(request.user as User, role)
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

  // if the user has any ref data, create that object too
  if (typeof requestData.counselorRef !== 'undefined') {
    await createCounselorRef(requestData, user.id)
  } else if (typeof requestData.schoolAdminRef !== 'undefined') {
    await createSchoolAdminRef(requestData, user.id)
  } else if (typeof requestData.schoolStaffRef !== 'undefined') {
    await createSchoolStaffRef(requestData, user.id)
  } else if (typeof requestData.studentRef !== 'undefined') {
    await createStudentRef(requestData, user.id)
  }

  // after everything is created and linked, query the new user to return
  const result = await findUserById(user.id)

  response.locals.data = result
  next()
}
