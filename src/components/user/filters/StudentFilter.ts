import { Role, User } from '@prisma/client'
import {
  CounselorDetailsInfo,
  findUserDetails,
  GuardianDetailsInfo,
  SchoolAdminDetailsInfo,
  SchoolStaffDetailsInfo,
  StudentDetailsInfo
} from '../userDetailsModel'
import { Filter } from './Filter'

// schools get access to themselves, their students and guardians, other facilitators from their school, and counselors assigned to their school
export class StudentFilter implements Filter<User> {
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
  const studentDetails = (await findUserDetails(
    reference
  )) as StudentDetailsInfo

  // student users have access to their own user
  if (target.id === reference.id) {
    return true
  } else if (target.role === ('SCHOOL_ADMIN' as Role)) {
    // student has access to school facilitators
    const schoolAdminDetails = (await findUserDetails(
      target
    )) as SchoolAdminDetailsInfo
    const schoolAdminSchoolId = schoolAdminDetails.assignedSchoolId
    return schoolAdminSchoolId === studentDetails.assignedSchoolId
  } else if (target.role === ('SCHOOL_STAFF' as Role)) {
    // student has access to school facilitators
    const schoolStaffDetails = (await findUserDetails(
      target
    )) as SchoolStaffDetailsInfo
    const schoolStaffSchoolId = schoolStaffDetails.assignedSchoolId
    return schoolStaffSchoolId === studentDetails.assignedSchoolId
  } else if (target.role === ('GUARDIAN' as Role)) {
    // student has access to their guardians
    const guardianDetails = (await findUserDetails(
      target
    )) as GuardianDetailsInfo

    for (const student of guardianDetails.students) {
      if (student.id === studentDetails.id) return true
    }
  } else if (target.role === ('COUNSELOR' as Role)) {
    // students have access to their assigned counselor
    const dbCounselorDetails = (await findUserDetails(
      target
    )) as CounselorDetailsInfo
    return dbCounselorDetails.id === studentDetails.assignedCounselorId
  }
  return false // if we haven't returned true yet, assume it's false.
}
