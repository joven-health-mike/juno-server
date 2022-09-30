import { Prisma, Role, User } from '@prisma/client'
import { prismaClient } from '../../database'

interface UserInfo {
  id?: string
  firstName?: string
  lastName?: string
  email?: string
  username?: string
  phone?: string
  docsUrl?: string
  timeZoneOffset?: number
  role?: Role
  counselorRef?: CounselorRef
}

interface CounselorRef {
  id?: string
  userId?: string
  roomLink?: string
}

const getUserFromUserInfo = (userInfo: UserInfo) => {
  return {
    firstName: userInfo.firstName,
    lastName: userInfo.lastName,
    email: userInfo.email,
    username: userInfo.username,
    phone: userInfo.phone,
    docsUrl: userInfo.docsUrl,
    timeZoneOffset: userInfo.timeZoneOffset,
    role: userInfo.role,
    counselorRef: undefined
  }
}

export const createUser = async (userInfo: UserInfo): Promise<User> => {
  const newUser = getUserFromUserInfo(userInfo)
  return await prismaClient.user.create({ data: newUser })
}

export const createCounselorRef = async (userInfo: UserInfo): Promise<User> => {
  const user = getUserFromUserInfo(userInfo)
  // TODO: create the counselorRef object associated with this user.
  // user.counselorRef = {
  //   create: { roomLink: userInfo.counselorRef.roomLink }
  // }
  return await prismaClient.user.create({ data: user })
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
