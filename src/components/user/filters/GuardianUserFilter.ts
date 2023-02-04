import { Role } from '@prisma/client'
import { Filter } from '../../Filter'
import { DetailedUser } from '../userModel'

// schools get access to themselves, their students and guardians, other facilitators from their school, and counselors assigned to their school
export class GuardianUserFilter implements Filter<DetailedUser> {
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
  // guardian users have access to their own user
  if (target.id === reference.id) {
    return true
  } else if (target.role === ('STUDENT' as Role)) {
    // guardians have access to any students in their list of students
    for (const guardianStudent of reference.guardianStudents) {
      if (target.id === guardianStudent.id) return true
    }
  } else if (target.role === ('SCHOOL_ADMIN' as Role)) {
    // guardian has access to school facilitators
    const schoolAdminSchoolId = target.schoolAdminAssignedSchoolId
    for (const guardianStudent of reference.guardianStudents) {
      if (schoolAdminSchoolId === guardianStudent.studentAssignedSchoolId)
        return true
    }
  } else if (target.role === ('SCHOOL_STAFF' as Role)) {
    // guardian has access to school facilitators
    const schoolStaffSchoolId = target.schoolStaffAssignedSchoolId
    for (const guardianStudent of reference.guardianStudents) {
      if (schoolStaffSchoolId === guardianStudent.studentAssignedSchoolId)
        return true
    }
  } else if (target.role === ('GUARDIAN' as Role)) {
    // guardian has access to other guardians of the same students
    const studentsInCommon = reference.guardianStudents
      .map(student => student.id) // create an array of guardian's student IDs
      .filter(
        value =>
          target.guardianStudents
            .map(student => student.id) // create an array of db guardian's student IDs
            .includes(value) // apply filter to only include common elements
      )
    return studentsInCommon.length > 0
  } else if (target.role === ('COUNSELOR' as Role)) {
    // guardian have access to their students' assigned counselor
    for (const student of reference.guardianStudents) {
      if (target.id === student.studentAssignedCounselorId) return true
    }
  }
  return false // if we haven't returned true yet, assume it's false.
}
