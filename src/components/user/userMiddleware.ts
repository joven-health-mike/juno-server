import {NextFunction, Request, Response} from 'express'

export const getUser = (request: Request, response: Response, next: NextFunction) => {
  const user = {
    id: 1,
    name: 'Jon Smith',
  }
  response.locals.data = user
  next()
}

export const createUser = (request: Request, response: Response, next: NextFunction) => {
  const user = {
    id: 2,
    name: 'Jake Smith',
  }
  response.locals.data = user
  next()
}
