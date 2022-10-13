import {
  CounselorDetails,
  Prisma,
  Role,
  SchoolAdminDetails,
  SchoolStaffDetails,
  StudentDetails,
  User
} from '@prisma/client'
import { prismaClient } from '../../database'
import { UserFilterDelegate } from './filters/UserFilterDelegate'

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
  schoolAdminRef?: SchoolAdminDetails
  schoolStaffRef?: SchoolStaffDetails
  studentRef?: StudentDetails
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

export const readCounselorRef = async (
  userId: string
): Promise<CounselorDetails> => {
  return await prismaClient.counselorDetails.findFirst({
    where: { userId: userId }
  })
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

export const updateCounselorRef = async (
  userInfo: UserInfo,
  userId: string
): Promise<CounselorDetails> => {
  const counselorDetails: CounselorDetails = {
    id:
      userInfo.counselorRef.id === '-1' ? undefined : userInfo.counselorRef.id,
    userId: userId,
    roomLink: userInfo.counselorRef.roomLink
  }
  return await prismaClient.counselorDetails.update({
    data: counselorDetails,
    where: { userId: userId }
  })
}

export const deleteCounselorRef = async (
  userId: string
): Promise<CounselorDetails> => {
  return await prismaClient.counselorDetails.delete({
    where: { userId: userId }
  })
}

export const readSchoolAdminRef = async (
  userId: string
): Promise<SchoolAdminDetails> => {
  return await prismaClient.schoolAdminDetails.findFirst({
    where: { userId: userId }
  })
}

export const createSchoolAdminRef = async (
  userInfo: UserInfo,
  userId: string
): Promise<SchoolAdminDetails> => {
  const schoolAdminDetails: SchoolAdminDetails = {
    id:
      userInfo.schoolAdminRef.id === '-1'
        ? undefined
        : userInfo.schoolAdminRef.id,
    userId: userId,
    assignedSchoolId: userInfo.schoolAdminRef.assignedSchoolId
  }
  return await prismaClient.schoolAdminDetails.create({
    data: schoolAdminDetails
  })
}

export const updateSchoolAdminRef = async (
  userInfo: UserInfo,
  userId: string
): Promise<SchoolAdminDetails> => {
  const schoolAdminDetails: SchoolAdminDetails = {
    id:
      userInfo.schoolAdminRef.id === '-1'
        ? undefined
        : userInfo.schoolAdminRef.id,
    userId: userId,
    assignedSchoolId: userInfo.schoolAdminRef.assignedSchoolId
  }
  return await prismaClient.schoolAdminDetails.update({
    data: schoolAdminDetails,
    where: { userId: userId }
  })
}

export const deleteSchoolAdminRef = async (
  userId: string
): Promise<SchoolAdminDetails> => {
  return await prismaClient.schoolAdminDetails.delete({
    where: { userId: userId }
  })
}

export const readSchoolStaffRef = async (
  userId: string
): Promise<SchoolStaffDetails> => {
  return await prismaClient.schoolStaffDetails.findFirst({
    where: { userId: userId }
  })
}

export const createSchoolStaffRef = async (
  userInfo: UserInfo,
  userId: string
): Promise<SchoolStaffDetails> => {
  const schoolStaffDetails: SchoolStaffDetails = {
    id:
      userInfo.schoolStaffRef.id === '-1'
        ? undefined
        : userInfo.schoolStaffRef.id,
    userId: userId,
    assignedSchoolId: userInfo.schoolStaffRef.assignedSchoolId
  }
  return await prismaClient.schoolStaffDetails.create({
    data: schoolStaffDetails
  })
}

export const updateSchoolStaffRef = async (
  userInfo: UserInfo,
  userId: string
): Promise<SchoolStaffDetails> => {
  const schoolStaffDetails: SchoolStaffDetails = {
    id:
      userInfo.schoolStaffRef.id === '-1'
        ? undefined
        : userInfo.schoolStaffRef.id,
    userId: userId,
    assignedSchoolId: userInfo.schoolStaffRef.assignedSchoolId
  }
  return await prismaClient.schoolStaffDetails.update({
    data: schoolStaffDetails,
    where: { userId: userId }
  })
}

export const deleteSchoolStaffRef = async (
  userId: string
): Promise<SchoolStaffDetails> => {
  return await prismaClient.schoolStaffDetails.delete({
    where: { userId: userId }
  })
}

export const readStudentRef = async (
  userId: string
): Promise<StudentDetails> => {
  return await prismaClient.studentDetails.findFirst({
    where: { userId: userId }
  })
}

export const createStudentRef = async (
  userInfo: UserInfo,
  userId: string
): Promise<StudentDetails> => {
  const studentDetails: StudentDetails = {
    id: userInfo.studentRef.id === '-1' ? undefined : userInfo.studentRef.id,
    userId: userId,
    assignedSchoolId: userInfo.studentRef.assignedSchoolId,
    assignedCounselorId: userInfo.studentRef.assignedCounselorId,
    status: userInfo.studentRef.status
  }
  return await prismaClient.studentDetails.create({
    data: studentDetails
  })
}

export const updateStudentRef = async (
  userInfo: UserInfo,
  userId: string
): Promise<StudentDetails> => {
  const studentDetails: StudentDetails = {
    id: userInfo.studentRef.id === '-1' ? undefined : userInfo.studentRef.id,
    userId: userId,
    assignedSchoolId: userInfo.studentRef.assignedSchoolId,
    assignedCounselorId: userInfo.studentRef.assignedCounselorId,
    status: userInfo.studentRef.status
  }
  return await prismaClient.studentDetails.update({
    data: studentDetails,
    where: { userId: userId }
  })
}

export const deleteStudentRef = async (
  userId: string
): Promise<StudentDetails> => {
  return await prismaClient.studentDetails.delete({
    where: { userId: userId }
  })
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
  return new UserFilterDelegate().get(loggedInUser).apply(users, loggedInUser)
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

export const deleteUser = async (id: string): Promise<User> => {
  // TODO: Mark user as deleted instead of actually deleting them
  return await prismaClient.user.delete({
    where: { id: id }
  })
}
