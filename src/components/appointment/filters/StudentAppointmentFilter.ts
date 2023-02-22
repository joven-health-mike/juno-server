import { Filter } from '../../Filter'
import { DetailedUser } from '../../user/userModel'
import {
  AppointmentInfo,
  DetailedAppointment,
  findAppointmentById
} from '../appointmentModel'

// schools get access to themselves, their students and guardians, other facilitators from their school, and counselors assigned to their school
export class StudentAppointmentFilter
  implements Filter<DetailedAppointment, DetailedUser>
{
  async apply(
    allItems: DetailedAppointment[],
    reference: DetailedUser
  ): Promise<DetailedAppointment[]> {
    const result = []

    // loop through users looking for associated users
    for (const dbAppointment of allItems) {
      if (await isAppointmentRelated(reference, dbAppointment)) {
        result.push(dbAppointment)
      }
    }

    return result
  }
}

async function isAppointmentRelated(
  reference: DetailedUser,
  target: DetailedAppointment
): Promise<boolean> {
  const fullAppointment = (await findAppointmentById(
    target.id
  )) as AppointmentInfo

  const studentsInCommon = fullAppointment.participants.filter(participant => {
    participant.id === reference.id
  })

  return studentsInCommon.length > 0
}
