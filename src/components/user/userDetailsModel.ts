import {
  Role,
  School,
  StudentDetails,
  StudentStatus,
  User
} from '@prisma/client'
import { prismaClient } from '../../database'

export interface BasicDetailsInfo {
  id?: string
  userId?: string
}

// unused for now
// interface SysAdminDetailsInfo extends BasicDetailsInfo {}
// interface JovenAdminDetailsInfo extends BasicDetailsInfo {}
// interface JovenStaffDetailsInfo extends BasicDetailsInfo {}

export interface GuardianDetailsInfo extends BasicDetailsInfo {
  students?: StudentDetails[]
}

export interface CounselorDetailsInfo extends BasicDetailsInfo {
  roomLink?: string
  assignedSchools?: School[]
}

export interface SchoolAdminDetailsInfo extends BasicDetailsInfo {
  assignedSchoolId?: string
}

export interface SchoolStaffDetailsInfo extends BasicDetailsInfo {
  assignedSchoolId?: string
}

export interface StudentDetailsInfo extends BasicDetailsInfo {
  assignedSchoolId?: string
  assignedCounselorId?: string
  status?: StudentStatus
}

export interface UserDetailsDelegate {
  read: (user: User) => Promise<BasicDetailsInfo>
}

export async function findUserDetails(user: User): Promise<BasicDetailsInfo> {
  return await getDelegate(user.role).read(user)
}

export function getDelegate(role: Role): UserDetailsDelegate {
  switch (role) {
    case 'SYSADMIN' as Role:
      return new SysAdminUserDetailsDelegate()
    case 'JOVEN_ADMIN' as Role:
      return new JovenAdminUserDetailsDelegate()
    case 'JOVEN_STAFF' as Role:
      return new JovenStaffUserDetailsDelegate()
    case 'SCHOOL_ADMIN' as Role:
      return new SchoolAdminUserDetailsDelegate()
    case 'SCHOOL_STAFF' as Role:
      return new SchoolStaffUserDetailsDelegate()
    case 'COUNSELOR' as Role:
      return new CounselorUserDetailsDelegate()
    case 'GUARDIAN' as Role:
      return new GuardianUserDetailsDelegate()
    case 'STUDENT' as Role:
      return new StudentUserDetailsDelegate()
  }
}

export class SysAdminUserDetailsDelegate implements UserDetailsDelegate {
  async read(user: User): Promise<BasicDetailsInfo> {
    const sysAdminDetails = await prismaClient.sysAdminDetails.findUnique({
      where: { userId: user.id }
    })
    return { id: sysAdminDetails.id, userId: sysAdminDetails.userId }
  }
}

export class JovenAdminUserDetailsDelegate implements UserDetailsDelegate {
  async read(user: User): Promise<BasicDetailsInfo> {
    const jovenAdminDetails = await prismaClient.jovenAdminDetails.findUnique({
      where: { userId: user.id }
    })
    return { id: jovenAdminDetails.id, userId: jovenAdminDetails.userId }
  }
}

export class JovenStaffUserDetailsDelegate implements UserDetailsDelegate {
  async read(user: User): Promise<BasicDetailsInfo> {
    const jovenStaffDetails = await prismaClient.jovenStaffDetails.findUnique({
      where: { userId: user.id }
    })
    return { id: jovenStaffDetails.id, userId: jovenStaffDetails.userId }
  }
}

export class SchoolAdminUserDetailsDelegate implements UserDetailsDelegate {
  async read(user: User): Promise<BasicDetailsInfo> {
    const schoolAdminDetails = await prismaClient.schoolAdminDetails.findUnique(
      {
        where: { userId: user.id }
      }
    )
    return {
      id: schoolAdminDetails.id,
      userId: schoolAdminDetails.userId,
      assignedSchoolId: schoolAdminDetails.assignedSchoolId
    } as SchoolAdminDetailsInfo
  }
}

export class SchoolStaffUserDetailsDelegate implements UserDetailsDelegate {
  async read(user: User): Promise<BasicDetailsInfo> {
    const schoolStaffDetails = await prismaClient.schoolStaffDetails.findUnique(
      {
        where: { userId: user.id }
      }
    )
    return {
      id: schoolStaffDetails.id,
      userId: schoolStaffDetails.userId,
      assignedSchoolId: schoolStaffDetails.assignedSchoolId
    } as SchoolStaffDetailsInfo
  }
}

export class CounselorUserDetailsDelegate implements UserDetailsDelegate {
  async read(user: User): Promise<BasicDetailsInfo> {
    const counselorDetails = await prismaClient.counselorDetails.findUnique({
      where: { userId: user.id },
      include: { assignedSchools: true }
    })
    return {
      id: counselorDetails.id,
      userId: counselorDetails.userId,
      roomLink: counselorDetails.roomLink,
      assignedSchools: counselorDetails.assignedSchools
    } as CounselorDetailsInfo
  }
}

export class GuardianUserDetailsDelegate implements UserDetailsDelegate {
  async read(user: User): Promise<GuardianDetailsInfo> {
    const guardianDetails = await prismaClient.guardianDetails.findUnique({
      where: { userId: user.id },
      include: { students: true }
    })
    return {
      id: guardianDetails.id,
      userId: guardianDetails.userId,
      students: guardianDetails.students
    }
  }
}

export class StudentUserDetailsDelegate implements UserDetailsDelegate {
  async read(user: User): Promise<BasicDetailsInfo> {
    const studentDetails = await prismaClient.studentDetails.findUnique({
      where: { userId: user.id }
    })
    return {
      id: studentDetails.id,
      userId: studentDetails.userId,
      assignedCounselorId: studentDetails.assignedCounselorId,
      assignedSchoolId: studentDetails.assignedSchoolId,
      status: studentDetails.status
    } as StudentDetailsInfo
  }
}
