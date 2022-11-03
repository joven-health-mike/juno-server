import { Appointment, Role, User } from '@prisma/client'
import { Filter } from '../../Filter'
import {
  findUserDetails,
  SchoolAdminDetailsInfo,
  SchoolStaffDetailsInfo
} from '../../user/userDetailsModel'

// schools get access to themselves, their students and guardians, other facilitators from their school, and counselors assigned to their school
export class SchoolAppointmentFilter implements Filter<Appointment> {
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
  const schoolDetails = await findUserDetails(reference)
  let schoolId: string
  if (reference.role === ('SCHOOL_ADMIN' as Role)) {
    schoolId = (schoolDetails as SchoolAdminDetailsInfo).assignedSchoolId
  } else {
    schoolId = (schoolDetails as SchoolStaffDetailsInfo).assignedSchoolId
  }
  return schoolId === target.schoolId
}
