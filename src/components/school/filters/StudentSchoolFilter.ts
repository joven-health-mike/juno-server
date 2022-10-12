import { School, User } from '@prisma/client'
import { Filter } from '../../Filter'
import {
  findUserDetails,
  StudentDetailsInfo
} from '../../user/userDetailsModel'

export class StudentSchoolFilter implements Filter<School> {
  async apply(allItems: School[], reference: User): Promise<School[]> {
    const result = []

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
  const studentDetails = (await findUserDetails(
    reference
  )) as StudentDetailsInfo

  return studentDetails.assignedSchoolId === target.id
}
