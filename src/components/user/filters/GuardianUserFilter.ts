import { Role, StudentDetails, User } from '@prisma/client'
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
export class GuardianUserFilter implements Filter<User> {
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
  const guardianDetails = (await findUserDetails(
    reference
  )) as GuardianDetailsInfo

  // guardian users have access to their own user
  if (target.id === reference.id) {
    return true
  } else if (target.role === ('STUDENT' as Role)) {
    const studentDetails = (await findUserDetails(target)) as StudentDetailsInfo
    // guardians have access to any students in their list of students
    for (const guardianStudents of guardianDetails.students) {
      if (studentDetails.id === guardianStudents.id) return true
    }
  } else if (target.role === ('SCHOOL_ADMIN' as Role)) {
    // guardian has access to school facilitators
    const schoolAdminDetails = (await findUserDetails(
      target
    )) as SchoolAdminDetailsInfo
    const schoolAdminSchoolId = schoolAdminDetails.assignedSchoolId
    for (const guardianStudent of guardianDetails.students) {
      if (schoolAdminSchoolId === guardianStudent.assignedSchoolId) return true
    }
  } else if (target.role === ('SCHOOL_STAFF' as Role)) {
    // student has access to school facilitators
    const schoolStaffDetails = (await findUserDetails(
      target
    )) as SchoolStaffDetailsInfo
    const schoolStaffSchoolId = schoolStaffDetails.assignedSchoolId
    for (const guardianStudent of guardianDetails.students) {
      if (schoolStaffSchoolId === guardianStudent.assignedSchoolId) return true
    }
  } else if (target.role === ('GUARDIAN' as Role)) {
    // student has access to their guardians
    const dbGuardianDetails = (await findUserDetails(
      target
    )) as GuardianDetailsInfo
    const studentsInCommon = (guardianDetails.students as StudentDetails[])
      .map(student => student.id) // create an array of guardian's student IDs
      .filter(
        value =>
          dbGuardianDetails.students
            .map(student => student.id) // create an array of db guardian's student IDs
            .includes(value) // apply filter to only include common elements
      )
    return studentsInCommon.length > 0
  } else if (target.role === ('COUNSELOR' as Role)) {
    // students have access to their assigned counselor
    const dbCounselorDetails = (await findUserDetails(
      target
    )) as CounselorDetailsInfo

    for (const student of guardianDetails.students) {
      if (dbCounselorDetails.id === student.assignedCounselorId) return true
    }
  }
  return false // if we haven't returned true yet, assume it's false.
}
