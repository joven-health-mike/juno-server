import { Prisma, Role, User } from '@prisma/client'
import { prismaClient } from '../../database'

interface UserInfo {
  id?: string
  email?: string
  name?: string
}

export const createUser = async (userInfo: UserInfo): Promise<User> => {
  const newUser = {
    id: userInfo.id,
    email: userInfo.email,
    firstName: userInfo.name.split(' ')[0],
    lastName: userInfo.name.split(' ')[1],
    username: userInfo.name.replace(/\s+/g, '.').toLowerCase(),
    role: Role.JOVEN_STAFF
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

export const findUserById = async (id: string): Promise<User | null> => {
  const user = await prismaClient.user.findUnique({
    where: { id }
  })
  return await prismaClient.user.findUnique({
    where: { id },
    include: getUserIncludeForRole(user.role)
  })
}

export const findAllUsers = async (): Promise<User[]> => {
  return await prismaClient.user.findMany()
}

export const findUsersByRole = async (role: Role): Promise<User[]> => {
  return await prismaClient.user.findMany({
    where: { role: role },
    include: getUserIncludeForRole(role)
  })
}

const getUserIncludeForRole = (role: Role): Prisma.UserInclude => {
  switch (role) {
    case Role.SYSADMIN:
      return null
    case Role.JOVEN_ADMIN:
      return null
    case Role.JOVEN_STAFF:
      return null
    case Role.SCHOOL_ADMIN:
      return {
        schoolAdminRef: {
          include: { assignedSchool: true }
        }
      }
    case Role.SCHOOL_STAFF:
      return {
        schoolStaffRef: {
          include: { assignedSchool: true }
        }
      }
    case Role.COUNSELOR:
      return {
        counselorRef: true
      }
    case Role.GUARDIAN:
      return {
        guardianRef: {
          include: {
            students: {
              include: { user: true }
            }
          }
        }
      }
    case Role.STUDENT:
      return {
        studentRef: {
          include: {
            assignedSchool: true,
            assignedCounselor: {
              include: {
                user: true
              }
            },
            guardians: {
              include: {
                user: true
              }
            }
          }
        }
      }
  }
}

export const updateUser = async (userInfo: User): Promise<User> => {
  return await prismaClient.user.update({
    data: userInfo,
    where: { id: userInfo.id }
  })
}
