import { NextFunction, Request, Response } from 'express'
import { findSchoolById } from './schoolModel'

export const getSchool = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  const schoolId = parseInt(request.params.id)
  try {
    const school = await findSchoolById(schoolId)
    response.locals.data = school
    next()
  } catch (error) {
    request.log.info('error, calling next')
    return next(error)
  }
}

export const createSchool = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  // TODO: Create school in database
  const school = {
    id: 2,
    name: 'Aardvark Academy',
    address: '123 Aardvark St',
    state: 'CO',
    zip: '80013',
    primaryEmail: 'aardvark-academy@jovenhealth.com',
    primaryPhone: '123-456-7890'
  }
  response.locals.data = school
  next()
}
