import { Role, User } from '@prisma/client'
import {
  CounselorDetailsInfo,
  findUserDetails,
  GuardianDetailsInfo,
  SchoolAdminDetailsInfo,
  SchoolStaffDetailsInfo,
  StudentDetailsInfo
} from '../userDetailsModel'
import { Filter } from '../../Filter'

// schools get access to themselves, their students and guardians, other facilitators from their school, and counselors assigned to their school
export class SchoolUserFilter implements Filter<User> {
  async apply(allItems: User[], reference: User): Promise<User[]> {
    const result = []

    // loop through users looking for associated users
    for (const dbUser of allItems) {
      if (await isUserRelated(reference, dbUser)) {
        result.push(dbUser)
      }
    }

    return result
  }
}

async function isUserRelated(reference: User, target: User): Promise<boolean> {
  const schoolDetails = await findUserDetails(reference)
  let schoolId: string
  if (reference.role === ('SCHOOL_ADMIN' as Role)) {
    schoolId = (schoolDetails as SchoolAdminDetailsInfo).assignedSchoolId
  } else {
    schoolId = (schoolDetails as SchoolStaffDetailsInfo).assignedSchoolId
  }

  // school users have access to their own user
  if (target.id === reference.id) {
    return true
  } else if (target.role === ('STUDENT' as Role)) {
    // school has access to students that are assigned to their school
    const studentDetails = (await findUserDetails(target)) as StudentDetailsInfo
    return schoolId === studentDetails.assignedSchoolId
  } else if (target.role === ('SCHOOL_ADMIN' as Role)) {
    // school has access to other school facilitators
    const schoolAdminDetails = (await findUserDetails(
      target
    )) as SchoolAdminDetailsInfo
    const schoolAdminSchoolId = schoolAdminDetails.assignedSchoolId
    return schoolAdminSchoolId === schoolId
  } else if (target.role === ('SCHOOL_STAFF' as Role)) {
    // school has access to other school facilitators
    const schoolStaffDetails = (await findUserDetails(
      target
    )) as SchoolStaffDetailsInfo
    const schoolStaffSchoolId = schoolStaffDetails.assignedSchoolId
    return schoolStaffSchoolId === schoolId
  } else if (target.role === ('GUARDIAN' as Role)) {
    // school has access to their students' guardians
    const guardianDetails = (await findUserDetails(
      target
    )) as GuardianDetailsInfo

    for (const student of guardianDetails.students) {
      if (student.assignedSchoolId === schoolId) return true
    }
  } else if (target.role === ('COUNSELOR' as Role)) {
    // school has access to counselors assigned to their school
    const dbCounselorDetails = (await findUserDetails(
      target
    )) as CounselorDetailsInfo

    for (const counselorSchool of dbCounselorDetails.assignedSchools) {
      if (counselorSchool.id === schoolId) {
        return true
      }
    }
  }
  return false // if we haven't returned true yet, assume it's false.
}
