import { prismaClient } from '../../database'
import { User } from '@prisma/client'

interface UserInfo {
  id?: number
  email?: string
  name?: string
}

export const createUser = async (userInfo: UserInfo): Promise<User> => {
  const newUser: User = {
    id: userInfo.id,
    email: userInfo.email,
    firstName: userInfo.name.split(' ')[0],
    lastName: userInfo.name.split(' ')[1],
    username: userInfo.name.replace(/\s+/g, '.').toLowerCase(),
    phone: '',
    docsUrl: '',
    timeZoneOffset: 0
  }

  return await prismaClient.user.create({ data: newUser })
}

export const findOrCreateUserByEmail = async (
  userInfo: UserInfo
): Promise<User> => {
  let userInDatabase = await findUserByEmail(userInfo.email)
  if (!userInDatabase) {
    userInDatabase = await createUser(userInfo)
  }
  return userInDatabase
}

export const findUserByEmail = async (email: string): Promise<User | null> => {
  // if (!email) {
  //   throw new Error(`A user with an email address "${email}" was not found.`)
  // }

  return await prismaClient.user.findUnique({
    where: { email }
  })
}

export const findUserById = async (id: number): Promise<User | null> => {
  // if (!id) {
  //   throw new Error(`A user with an id "${id}" was not found.`)
  // }
  return await prismaClient.user.findUnique({
    where: { id }
  })
}

export const updateUser = async (userInfo: UserInfo): Promise<User> => {
  return await prismaClient.user.update({
    data: userInfo as User,
    where: { id: userInfo.id }
  })
}
