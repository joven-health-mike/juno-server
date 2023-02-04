import { Role, School } from '@prisma/client'
import { Filter } from '../../Filter'
import { DetailedUser } from '../userModel'

// counselors get access to themselves, their students, and facilitators associated with the schools they're assigned to
export class CounselorUserFilter implements Filter<DetailedUser> {
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
  // counselor has access to their own user
  if (target.id === reference.id) {
    return true
  } else if (target.role === ('STUDENT' as Role)) {
    // counselor has access to students that are assigned to their caseload
    return reference.id === target.studentAssignedCounselorId
  } else if (target.role === ('SCHOOL_ADMIN' as Role)) {
    const schoolAdminSchoolId = target.schoolAdminAssignedSchoolId

    for (const counselorSchool of reference.counselorAssignedSchools) {
      // counselor has access to schoolAdmins for the schools they're working with
      if (counselorSchool.id === schoolAdminSchoolId) {
        return true
      }
    }
  } else if (target.role === ('SCHOOL_STAFF' as Role)) {
    const schoolStaffSchoolId = target.schoolStaffAssignedSchoolId

    for (const counselorSchool of reference.counselorAssignedSchools) {
      // counselor has access to schoolStaff for the schools they're working with
      return counselorSchool.id === schoolStaffSchoolId
    }
  } else if (target.role === ('GUARDIAN' as Role)) {
    for (const student of target.guardianStudents) {
      // counselor has access to their students' guardians
      return student.studentAssignedCounselorId === reference.id
    }
  } else if (target.role === ('COUNSELOR' as Role)) {
    const schoolsInCommon = (reference.counselorAssignedSchools as School[])
      .map(school => school.id) // create an array of counselor's school IDs
      .filter(
        value =>
          target.counselorAssignedSchools
            .map(school => school.id) // create an array of db counselor's school IDs
            .includes(value) // apply filter to only include common elements
      )

    // counselor has access to other counselors assigned to the same school
    return schoolsInCommon.length > 0
  }
  return false // if we haven't returned true yet, assume it's false.
}
