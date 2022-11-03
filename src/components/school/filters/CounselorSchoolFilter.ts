import { School, User } from '@prisma/client'
import { Filter } from '../../Filter'
import {
  CounselorDetailsInfo,
  findUserDetails
} from '../../user/userDetailsModel'

export class CounselorSchoolFilter implements Filter<School> {
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
  const counselorDetails = (await findUserDetails(
    reference
  )) as CounselorDetailsInfo

  const studentsInCommon = (counselorDetails.assignedSchools as School[])
    .map(school => school.id)
    .filter(value => value === target.id)

  return studentsInCommon.length > 0
}
