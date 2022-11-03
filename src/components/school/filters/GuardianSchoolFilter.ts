import { School, StudentDetails, User } from '@prisma/client'
import { Filter } from '../../Filter'
import {
  findUserDetails,
  GuardianDetailsInfo
} from '../../user/userDetailsModel'

export class GuardianSchoolFilter implements Filter<School> {
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
  const guardianDetails = (await findUserDetails(
    reference
  )) as GuardianDetailsInfo

  const schoolsInCommon = (guardianDetails.students as StudentDetails[])
    .map(student => student.assignedSchoolId)
    .filter(value => value === target.id)

  return schoolsInCommon.length > 0
}
