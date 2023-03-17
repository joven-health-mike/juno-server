import { Role, StudentStatus, User, School } from '@prisma/client'
import { prismaClient } from '../../database'
import { UserFilterDelegate } from './filters/UserFilterDelegate'

export type DetailedUser = User & {
  guardianStudents: User[]
  counselorAssignedSchools: School[]
}

const userInclude = { guardianStudents: true, counselorAssignedSchools: true }

interface UserInfo {
  id?: string
  firstName?: string
  lastName?: string
  email?: string
  username?: string
  phone?: string
  docsUrl?: string
  counselorRoomLink?: string
  counselorRoomLink2?: string
  schoolAdminAssignedSchoolId?: string
  schoolStaffAssignedSchoolId?: string
  studentAssignedCounselorId?: string
  studentAssignedSchoolId?: string
  studentStatus?: StudentStatus
  timeZoneIanaName?: string
  role?: Role
  guardianStudents?: User[]
  counselorAssignedSchools?: School[]
}

const getGuardianStudentsConnectionStr = (guardianStudents: User[]) => {
  if (guardianStudents?.length > 0) {
    const result: any = {}
    result.connect = []
    guardianStudents.forEach(student => result.connect.push({ id: student.id }))
    return result
  } else {
    return undefined
  }
}

const getCounselorAssignedSchoolsConnectionStr = (
  counselorAssignedSchools: School[]
) => {
  if (counselorAssignedSchools?.length > 0) {
    const result: any = {}
    result.connect = []
    counselorAssignedSchools.forEach(school =>
      result.connect.push({ id: school.id })
    )
    return result
  } else {
    return undefined
  }
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
    counselorRoomLink: userInfo.counselorRoomLink,
    counselorRoomLink2: userInfo.counselorRoomLink2,
    schoolAdminAssignedSchoolId: userInfo.schoolAdminAssignedSchoolId,
    schoolStaffAssignedSchoolId: userInfo.schoolStaffAssignedSchoolId,
    studentAssignedCounselorId: userInfo.studentAssignedCounselorId,
    studentAssignedSchoolId: userInfo.studentAssignedSchoolId,
    studentStatus: userInfo.studentStatus,
    timeZoneIanaName: userInfo.timeZoneIanaName,
    role: userInfo.role,
    guardianStudents: getGuardianStudentsConnectionStr(
      userInfo.guardianStudents
    ),
    counselorAssignedSchools: getCounselorAssignedSchoolsConnectionStr(
      userInfo.counselorAssignedSchools
    )
  }
}

export const createUser = async (userInfo: UserInfo): Promise<DetailedUser> => {
  const newUser = getUserFromUserInfo(userInfo)
  return await prismaClient.user.create({
    data: newUser as User,
    include: userInclude
  })
}

export const findUserByUsername = async (
  username: string
): Promise<DetailedUser> => {
  return await prismaClient.user.findUnique({
    where: { username: username },
    include: userInclude
  })
}

export const findOrCreateUserByEmail = async (
  userInfo: UserInfo
): Promise<DetailedUser> => {
  let userInDatabase = await findUserByUsername(userInfo.username)
  if (!userInDatabase) {
    userInDatabase = await createUser(userInfo)
  }
  return userInDatabase
}

export const findUserById = async (id: string): Promise<User | null> => {
  return await prismaClient.user.findUnique({
    where: { id },
    include: userInclude
  })
}

export const findAllUsers = async (
  loggedInUser: DetailedUser
): Promise<DetailedUser[]> => {
  const allUsers = await prismaClient.user.findMany({ include: userInclude })
  return filterUsers(loggedInUser, allUsers)
}

// only return users that are related to the logged-in user somehow
const filterUsers = async (
  loggedInUser: DetailedUser,
  users: DetailedUser[]
): Promise<DetailedUser[]> => {
  return new UserFilterDelegate().get(loggedInUser).apply(users, loggedInUser)
}

export const findUsersByRole = async (
  loggedInUser: DetailedUser,
  role: Role
): Promise<DetailedUser[]> => {
  const allUsers = await prismaClient.user.findMany({
    where: { role: role },
    include: userInclude
  })
  return filterUsers(loggedInUser, allUsers)
}

export const updateUser = async (userInfo: UserInfo): Promise<User> => {
  const sanitizedUserInfo = getUserFromUserInfo(userInfo)
  // clear out old connections
  await prismaClient.user.update({
    where: { id: sanitizedUserInfo.id },
    data: {
      guardianStudents: { set: [] },
      counselorAssignedSchools: { set: [] }
    }
  })
  // add new connections
  return await prismaClient.user.update({
    data: sanitizedUserInfo,
    where: { id: sanitizedUserInfo.id },
    include: userInclude
  })
}

export const deleteUser = async (id: string): Promise<User> => {
  // TODO: Mark user as deleted instead of actually deleting them
  return await prismaClient.user.delete({
    where: { id: id }
  })
}
