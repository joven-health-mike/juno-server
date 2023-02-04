import { NextFunction, Request, Response } from 'express'
import { DetailedUser } from '../user/userModel'
import {
  findSchoolById,
  findAllSchools,
  createSchool,
  updateSchool,
  deleteSchool
} from './schoolModel'

export const getSchool = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  const schoolId = request.params.id
  try {
    const school = await findSchoolById(schoolId)
    response.locals.data = school
    next()
  } catch (error) {
    request.log.info('error, calling next')
    return next(error)
  }
}

export const getAllSchools = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const school = await findAllSchools(request.user as DetailedUser)
    response.locals.data = school
    next()
  } catch (error) {
    request.log.info('error, calling next')
    return next(error)
  }
}

export const createNewSchool = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  const requestData = request.body
  const school = await createSchool(requestData)
  response.locals.data = school
  next()
}

export const updateExistingSchool = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  const requestData = request.body
  const urlParamId = request.params.id
  if (urlParamId === requestData.id) {
    const school = await updateSchool(requestData)
    response.locals.data = school
  } else {
    // TODO: ID of the passed-in object didn't match ID of the URL
  }
  next()
}

export const deleteExistingSchool = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  const appointmentIdToDelete = request.params.id
  const school = await deleteSchool(appointmentIdToDelete)
  response.locals.data = school
  next()
}
