import { Role, School, User } from '@prisma/client'
import { Filter } from '../../Filter'
import {
  findUserDetails,
  SchoolAdminDetailsInfo,
  SchoolStaffDetailsInfo
} from '../../user/userDetailsModel'

export class SchoolSchoolFilter implements Filter<School> {
  async apply(allItems: School[], reference: User): Promise<School[]> {
    const result = []

    // loop through schools looking for associated schools
    for (const dbSchool of allItems) {
      if (await isSchoolRelated(reference, dbSchool)) {
        result.push(dbSchool)
      }
    }

    return result
  }
}

async function isSchoolRelated(
  reference: User,
  target: School
): Promise<boolean> {
  const schoolDetails = await findUserDetails(reference)
  let schoolId: string
  if (reference.role === ('SCHOOL_ADMIN' as Role)) {
    schoolId = (schoolDetails as SchoolAdminDetailsInfo).assignedSchoolId
  } else {
    schoolId = (schoolDetails as SchoolStaffDetailsInfo).assignedSchoolId
  }

  return schoolId === target.id
}
