import { Role, School } from '@prisma/client'
import { Filter } from '../../Filter'
import { DetailedUser } from '../../user/userModel'

export class SchoolSchoolFilter implements Filter<School, DetailedUser> {
  async apply(allItems: School[], reference: DetailedUser): Promise<School[]> {
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
  reference: DetailedUser,
  target: School
): Promise<boolean> {
  let schoolId: string
  if (reference.role === ('SCHOOL_ADMIN' as Role)) {
    schoolId = reference.schoolAdminAssignedSchoolId
  } else {
    schoolId = reference.schoolStaffAssignedSchoolId
  }

  return schoolId === target.id
}
