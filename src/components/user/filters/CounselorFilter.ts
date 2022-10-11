import { Role, School, User } from '@prisma/client'
import {
  CounselorDetailsInfo,
  findUserDetails,
  GuardianDetailsInfo,
  SchoolAdminDetailsInfo,
  SchoolStaffDetailsInfo,
  StudentDetailsInfo
} from '../userDetailsModel'
import { Filter } from './Filter'

// counselors get access to themselves, their students, and facilitators associated with the schools they're assigned to
export class CounselorFilter implements Filter<User> {
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
  const counselorDetails = (await findUserDetails(
    reference
  )) as CounselorDetailsInfo

  // counselor has access to their own user
  if (target.id === reference.id) {
    return true
  } else if (target.role === ('STUDENT' as Role)) {
    // counselor has access to students that are assigned to their caseload
    const studentDetails = (await findUserDetails(target)) as StudentDetailsInfo
    return counselorDetails.id === studentDetails.assignedCounselorId
  } else if (target.role === ('SCHOOL_ADMIN' as Role)) {
    const schoolAdminDetails = (await findUserDetails(
      target
    )) as SchoolAdminDetailsInfo
    const schoolAdminSchoolId = schoolAdminDetails.assignedSchoolId

    for (const counselorSchool of counselorDetails.assignedSchools) {
      // counselor has access to schoolAdmins for the schools they're working with
      if (counselorSchool.id === schoolAdminSchoolId) {
        return true
      }
    }
  } else if (target.role === ('SCHOOL_STAFF' as Role)) {
    const schoolStaffDetails = (await findUserDetails(
      target
    )) as SchoolStaffDetailsInfo
    const schoolStaffSchoolId = schoolStaffDetails.assignedSchoolId

    for (const counselorSchool of counselorDetails.assignedSchools) {
      // counselor has access to schoolStaff for the schools they're working with
      return counselorSchool.id === schoolStaffSchoolId
    }
  } else if (target.role === ('GUARDIAN' as Role)) {
    const guardianDetails = (await findUserDetails(
      target
    )) as GuardianDetailsInfo

    for (const student of guardianDetails.students) {
      // counselor has access to their students' guardians
      return student.assignedCounselorId === counselorDetails.id
    }
  } else if (target.role === ('COUNSELOR' as Role)) {
    const dbCounselorDetails = (await findUserDetails(
      target
    )) as CounselorDetailsInfo

    const schoolsInCommon = (counselorDetails.assignedSchools as School[])
      .map(school => school.id) // create an array of counselor's school IDs
      .filter(
        value =>
          dbCounselorDetails.assignedSchools
            .map(school => school.id) // create an array of db counselor's school IDs
            .includes(value) // apply filter to only include common elements
      )

    // counselor has access to other counselors assigned to the same school
    return schoolsInCommon.length > 0
  }
  return false // if we haven't returned true yet, assume it's false.
}
