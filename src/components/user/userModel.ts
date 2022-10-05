import { CounselorDetails, Prisma, Role, User } from '@prisma/client'
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
  counselorRef?: CounselorDetails
}

const getUserFromUserInfo = (userInfo: UserInfo) => {
  return {
    id: userInfo.id === '-1' ? undefined : userInfo.id,
    firstName: userInfo.firstName,
    lastName: userInfo.lastName,
    email: userInfo.email,
    username: userInfo.username,
    phone: userInfo.phone,
    docsUrl: userInfo.docsUrl,
    timeZoneOffset: userInfo.timeZoneOffset,
    role: userInfo.role
  }
}

export const createUser = async (userInfo: UserInfo): Promise<User> => {
  const newUser = getUserFromUserInfo(userInfo)
  return await prismaClient.user.create({ data: newUser })
}

export const createCounselorRef = async (
  userInfo: UserInfo,
  userId: string
): Promise<CounselorDetails> => {
  const counselorDetails: CounselorDetails = {
    id:
      userInfo.counselorRef.id === '-1' ? undefined : userInfo.counselorRef.id,
    userId: userId,
    roomLink: userInfo.counselorRef.roomLink
  }
  return await prismaClient.counselorDetails.create({ data: counselorDetails })
}

export const findUserByUsername = async (username: string): Promise<User> => {
  return await prismaClient.user.findUnique({
    where: { username }
  })
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

export const findAllUsers = async (loggedInUser: User): Promise<User[]> => {
  const allUsers = await prismaClient.user.findMany()
  return filterUsers(loggedInUser, allUsers)
}

// only return users that are related to the logged-in user somehow
const filterUsers = async (
  loggedInUser: User,
  users: User[]
): Promise<User[]> => {
  let counselorDetails
  let result = []
  switch (loggedInUser.role) {
    case 'SYSADMIN' as Role:
    case 'JOVEN_ADMIN' as Role:
    case 'JOVEN_STAFF' as Role:
      // return all values for Joven employees
      result = [...users]
      break
    case 'COUNSELOR' as Role:
      // counselors get access to themselves, their students, and facilitators associated with the schools they're assigned to
      counselorDetails = await prismaClient.counselorDetails.findUnique({
        where: { userId: loggedInUser.id },
        include: {
          assignedSchools: true
        }
      })
      // loop through users looking for associated users
      for (const dbUser of users) {
        // counselor has access to their own user
        if (dbUser.id === loggedInUser.id) {
          result.push(dbUser)
        }
        // counselor has access to students that are assigned to their caseload
        else if (dbUser.role === ('STUDENT' as Role)) {
          const studentDetails = await prismaClient.studentDetails.findUnique({
            where: { userId: dbUser.id }
          })
          if (counselorDetails.id === studentDetails.assignedCounselorId) {
            result.push(dbUser)
          }
        }
        // counselor has access to schoolAdmins for the schools they're working with
        else if (dbUser.role === ('SCHOOL_ADMIN' as Role)) {
          const schoolAdminDetails =
            await prismaClient.schoolAdminDetails.findUnique({
              where: { userId: dbUser.id }
            })
          const schoolAdminSchoolId = schoolAdminDetails.assignedSchoolId

          for (const counselorSchool of counselorDetails.assignedSchools) {
            // if the school admin is assigned to the same school as the counselor, add the user
            if (counselorSchool.id === schoolAdminSchoolId) {
              result.push(dbUser)
              break
            }
          }
        } else if (dbUser.role === ('SCHOOL_STAFF' as Role)) {
          const schoolStaffDetails =
            await prismaClient.schoolStaffDetails.findUnique({
              where: { userId: dbUser.id }
            })
          const schoolStaffSchoolId = schoolStaffDetails.assignedSchoolId

          for (const counselorSchool of counselorDetails.assignedSchools) {
            // if the school admin is assigned to the same school as the counselor, add the user
            if (counselorSchool.id === schoolStaffSchoolId) {
              result.push(dbUser)
              break
            }
          }
        }
      }
      break
    case 'SCHOOL_ADMIN' as Role:
      // return all values for now
      result = [...users]
      break
    case 'SCHOOL_STAFF' as Role:
      // return all values for now
      result = [...users]
      break
    case 'STUDENT' as Role:
      // return all values for now
      result = [...users]
      break
    case 'GUARDIAN' as Role:
      // return all values for now
      result = [...users]
      break
    default:
      break
  }
  return result
}

export const findUsersByRole = async (
  loggedInUser: User,
  role: Role
): Promise<User[]> => {
  const allUsers = await prismaClient.user.findMany({
    where: { role: role },
    include: getUserIncludeForRole(role)
  })
  return filterUsers(loggedInUser, allUsers)
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
