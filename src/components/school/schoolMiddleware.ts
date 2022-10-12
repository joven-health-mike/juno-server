import { User } from '@prisma/client'
import { NextFunction, Request, Response } from 'express'
import { findSchoolById, findAllSchools, createSchool } from './schoolModel'

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
    const school = await findAllSchools(request.user as User)
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
