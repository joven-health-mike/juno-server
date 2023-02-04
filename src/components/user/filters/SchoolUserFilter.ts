import { Role } from '@prisma/client'
import { Filter } from '../../Filter'
import { DetailedUser } from '../userModel'

// schools get access to themselves, their students and guardians, other facilitators from their school, and counselors assigned to their school
export class SchoolUserFilter implements Filter<DetailedUser> {
  async apply(
    allItems: DetailedUser[],
    reference: DetailedUser
  ): Promise<DetailedUser[]> {
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

async function isUserRelated(
  reference: DetailedUser,
  target: DetailedUser
): Promise<boolean> {
  let schoolId: string
  if (reference.role === ('SCHOOL_ADMIN' as Role)) {
    schoolId = reference.schoolAdminAssignedSchoolId
  } else {
    schoolId = reference.schoolStaffAssignedSchoolId
  }

  // school users have access to their own user
  if (target.id === reference.id) {
    return true
  } else if (target.role === ('STUDENT' as Role)) {
    // school has access to students that are assigned to their school
    return schoolId === target.studentAssignedSchoolId
  } else if (target.role === ('SCHOOL_ADMIN' as Role)) {
    // school has access to other school facilitators
    const schoolAdminSchoolId = target.schoolAdminAssignedSchoolId
    return schoolAdminSchoolId === schoolId
  } else if (target.role === ('SCHOOL_STAFF' as Role)) {
    // school has access to other school facilitators
    const schoolStaffSchoolId = target.schoolStaffAssignedSchoolId
    return schoolStaffSchoolId === schoolId
  } else if (target.role === ('GUARDIAN' as Role)) {
    // school has access to their students' guardians
    for (const student of target.guardianStudents) {
      if (student.studentAssignedSchoolId === schoolId) return true
    }
  } else if (target.role === ('COUNSELOR' as Role)) {
    // school has access to counselors assigned to their school
    for (const counselorSchool of target.counselorAssignedSchools) {
      if (counselorSchool.id === schoolId) {
        return true
      }
    }
  }
  return false // if we haven't returned true yet, assume it's false.
}
