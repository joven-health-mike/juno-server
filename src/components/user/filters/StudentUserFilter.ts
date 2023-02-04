import { Role } from '@prisma/client'
import { Filter } from '../../Filter'
import { DetailedUser } from '../userModel'

// schools get access to themselves, their students and guardians, other facilitators from their school, and counselors assigned to their school
export class StudentUserFilter implements Filter<DetailedUser> {
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
  // student users have access to their own user
  if (target.id === reference.id) {
    return true
  } else if (target.role === ('SCHOOL_ADMIN' as Role)) {
    // student has access to school facilitators
    const schoolAdminSchoolId = target.schoolAdminAssignedSchoolId
    return schoolAdminSchoolId === reference.studentAssignedSchoolId
  } else if (target.role === ('SCHOOL_STAFF' as Role)) {
    // student has access to school facilitators
    const schoolStaffSchoolId = target.schoolStaffAssignedSchoolId
    return schoolStaffSchoolId === reference.studentAssignedSchoolId
  } else if (target.role === ('GUARDIAN' as Role)) {
    // student has access to their guardians
    for (const student of target.guardianStudents) {
      if (student.id === reference.id) return true
    }
  } else if (target.role === ('COUNSELOR' as Role)) {
    // students have access to their assigned counselor
    return target.id === reference.studentAssignedCounselorId
  }
  return false // if we haven't returned true yet, assume it's false.
}
