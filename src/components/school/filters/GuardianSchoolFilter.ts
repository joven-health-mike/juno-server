import { School } from '@prisma/client'
import { Filter } from '../../Filter'
import { DetailedUser } from '../../user/userModel'

export class GuardianSchoolFilter implements Filter<School, DetailedUser> {
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
  const schoolsInCommon = (reference.guardianStudents as DetailedUser[])
    .map(student => student.studentAssignedSchoolId)
    .filter(value => value === target.id)

  return schoolsInCommon.length > 0
}
