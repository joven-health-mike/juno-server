import { School } from '@prisma/client'
import { Filter } from '../../Filter'
import { DetailedUser } from '../../user/userModel'

export class CounselorSchoolFilter implements Filter<School, DetailedUser> {
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
  const studentsInCommon = (reference.counselorAssignedSchools as School[])
    .map(school => school.id)
    .filter(value => value === target.id)

  return studentsInCommon.length > 0
}
