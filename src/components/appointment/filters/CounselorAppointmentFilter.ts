import { Appointment, User } from '@prisma/client'
import { Filter } from '../../Filter'
import {
  CounselorDetailsInfo,
  findUserDetails
} from '../../user/userDetailsModel'

export class CounselorAppointmentFilter implements Filter<Appointment> {
  async apply(
    allItems: Appointment[],
    reference: User
  ): Promise<Appointment[]> {
    const result = []

    // loop through appointments looking for associated appointments
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
  const counselorDetails = (await findUserDetails(
    reference
  )) as CounselorDetailsInfo
  return target.counselorId === counselorDetails.id
}
