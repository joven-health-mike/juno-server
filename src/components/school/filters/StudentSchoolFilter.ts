import { School } from '@prisma/client'
import { Filter } from '../../Filter'
import { DetailedUser } from '../../user/userModel'

export class StudentSchoolFilter implements Filter<School> {
  async apply(allItems: School[], reference: DetailedUser): Promise<School[]> {
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
  reference: DetailedUser,
  target: School
): Promise<boolean> {
  return reference.studentAssignedSchoolId === target.id
}
