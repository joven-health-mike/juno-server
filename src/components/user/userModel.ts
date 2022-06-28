import { Role, User } from '@prisma/client'
import { prismaClient } from '../../database'

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
  const user = await prismaClient.user.findUnique({
    where: { id }
  })

  switch (user.role) {
    case Role.SYSADMIN:
      return await prismaClient.user.findUnique({
        where: { id }
      })
    case Role.JOVEN_ADMIN:
      return await prismaClient.user.findUnique({
        where: { id }
      })
    case Role.JOVEN_STAFF:
      return await prismaClient.user.findUnique({
        where: { id }
      })
    case Role.SCHOOL_ADMIN:
      return await prismaClient.user.findUnique({
        where: { id },
        include: {
          schoolAdminRef: {
            include: { assignedSchool: true }
          }
        }
      })
    case Role.SCHOOL_STAFF:
      return await prismaClient.user.findUnique({
        where: { id },
        include: {
          schoolStaffRef: {
            include: { assignedSchool: true }
          }
        }
      })
    case Role.COUNSELOR:
      return await prismaClient.user.findUnique({
        where: { id },
        include: {
          counselorRef: true
        }
      })
    case Role.GUARDIAN:
      return await prismaClient.user.findUnique({
        where: { id },
        include: {
          guardianRef: {
            include: {
              students: {
                include: { user: true }
              }
            }
          }
        }
      })
    case Role.STUDENT:
      return await prismaClient.user.findUnique({
        where: { id },
        include: {
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
      })
  }
}

export const findAllUsers = async (): Promise<User[]> => {
  return await prismaClient.user.findMany()
}

export const findUsersByRole = async (role: Role): Promise<User[]> => {
  switch (role) {
    case Role.SYSADMIN:
      return await prismaClient.user.findMany({
        where: { role: role }
      })
    case Role.JOVEN_ADMIN:
      return await prismaClient.user.findMany({
        where: { role: role }
      })
    case Role.JOVEN_STAFF:
      return await prismaClient.user.findMany({
        where: { role: role }
      })
    case Role.SCHOOL_ADMIN:
      return await prismaClient.user.findMany({
        where: { role: role },
        include: {
          schoolAdminRef: {
            include: { assignedSchool: true }
          }
        }
      })
    case Role.SCHOOL_STAFF:
      return await prismaClient.user.findMany({
        where: { role: role },
        include: {
          schoolStaffRef: {
            include: { assignedSchool: true }
          }
        }
      })
    case Role.COUNSELOR:
      return await prismaClient.user.findMany({
        where: { role: role },
        include: {
          counselorRef: true
        }
      })
    case Role.GUARDIAN:
      return await prismaClient.user.findMany({
        where: { role: role },
        include: {
          guardianRef: {
            include: {
              students: {
                include: { user: true }
              }
            }
          }
        }
      })
    case Role.STUDENT:
      return await prismaClient.user.findMany({
        where: { role: role },
        include: {
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
      })
  }
}

export const updateUser = async (userInfo: User): Promise<User> => {
  return await prismaClient.user.update({
    data: userInfo,
    where: { id: userInfo.id }
  })
}
