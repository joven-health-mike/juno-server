import { Appointment, User } from '@prisma/client'
import { Filter } from '../../Filter'
import {
  findUserDetails,
  StudentDetailsInfo
} from '../../user/userDetailsModel'
import { AppointmentInfo, findAppointmentById } from '../appointmentModel'

// schools get access to themselves, their students and guardians, other facilitators from their school, and counselors assigned to their school
export class StudentAppointmentFilter implements Filter<Appointment> {
  async apply(
    allItems: Appointment[],
    reference: User
  ): Promise<Appointment[]> {
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
  reference: User,
  target: Appointment
): Promise<boolean> {
  const studentDetails = (await findUserDetails(
    reference
  )) as StudentDetailsInfo
  const fullAppointment = (await findAppointmentById(
    target.id
  )) as AppointmentInfo

  const studentsInCommon = fullAppointment.participants.filter(participant => {
    participant.id === studentDetails.userId
  })

  return studentsInCommon.length > 0
}
