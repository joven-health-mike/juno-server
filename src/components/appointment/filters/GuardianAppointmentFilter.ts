import { User } from '@prisma/client'
import { Filter } from '../../Filter'
import { DetailedUser } from '../../user/userModel'
import { DetailedAppointment } from '../appointmentModel'

export class GuardianAppointmentFilter
  implements Filter<DetailedAppointment, DetailedUser>
{
  async apply(
    allItems: DetailedAppointment[],
    reference: DetailedUser
  ): Promise<DetailedAppointment[]> {
    const result = []

    // loop through appointments looking for associated appointments
    for (const dbAppointment of allItems) {
      if (await isUserRelated(reference, dbAppointment)) {
        result.push(dbAppointment)
      }
    }

    return result
  }
}

async function isUserRelated(
  reference: DetailedUser,
  target: DetailedAppointment
): Promise<boolean> {
  const studentsInCommon = (reference.guardianStudents as User[])
    .map(student => student.id) // create an array of guardian's student IDs
    .filter(
      value =>
        target.participants
          .map(participant => participant.id) // create an array of participant IDs
          .includes(value) // apply filter to only include common elements
    )

  return studentsInCommon.length > 0
}
