import { Appointment, StudentDetails, User } from '@prisma/client'
import { Filter } from '../../Filter'
import {
  findUserDetails,
  GuardianDetailsInfo
} from '../../user/userDetailsModel'
import { findAppointmentById, AppointmentInfo } from '../appointmentModel'

export class GuardianAppointmentFilter implements Filter<Appointment> {
  async apply(
    allItems: Appointment[],
    reference: User
  ): Promise<Appointment[]> {
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
  reference: User,
  target: Appointment
): Promise<boolean> {
  const guardianDetails = (await findUserDetails(
    reference
  )) as GuardianDetailsInfo
  const fullAppointment = (await findAppointmentById(
    target.id
  )) as AppointmentInfo

  const studentsInCommon = (guardianDetails.students as StudentDetails[])
    .map(student => student.userId) // create an array of guardian's student IDs
    .filter(
      value =>
        fullAppointment.participants
          .map(participant => participant.id) // create an array of participant IDs
          .includes(value) // apply filter to only include common elements
    )

  // counselor has access to other counselors assigned to the same school
  return studentsInCommon.length > 0
}
