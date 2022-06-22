import { prismaClient } from '../../database'
import { Role, User } from '@prisma/client'

interface UserInfo {
  id?: number
  email?: string
  name?: string
}

export const createUser = async (userInfo: UserInfo): Promise<User> => {
  const newUser = {
    id: userInfo.id,
    email: userInfo.email,
    firstName: userInfo.name.split(' ')[0],
    lastName: userInfo.name.split(' ')[1],
    username: userInfo.name.replace(/\s+/g, '.').toLowerCase()
  }

  return await prismaClient.user.create({ data: newUser as User })
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
  return await prismaClient.user.findUnique({
    where: { email }
  })
}

export const findUserById = async (id: number): Promise<User | null> => {
  return await prismaClient.user.findUnique({
    where: { id }
  })
}

export const findUsersByRole = async (role: Role): Promise<User[]> => {
  return await prismaClient.user.findMany({ where: { role: role } })
}

export const updateUser = async (userInfo: User): Promise<User> => {
  return await prismaClient.user.update({
    data: userInfo,
    where: { id: userInfo.id }
  })
}
