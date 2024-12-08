import { Appointment, Role, User } from '@prisma/client'
import { Filter } from '../../Filter'
import { DetailedUser } from '../../user/userModel'
import { DetailedAppointment } from '../appointmentModel'

// schools get access to themselves, their students and guardians, other facilitators from their school, and counselors assigned to their school
export class SchoolAppointmentFilter
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
  reference: User,
  target: Appointment
): Promise<boolean> {
  let schoolId: string
  if (reference.role === ('SCHOOL_ADMIN' as Role)) {
    schoolId = reference.schoolAdminAssignedSchoolId
  } else {
    schoolId = reference.schoolStaffAssignedSchoolId
  }
  return schoolId === target.schoolId
}
