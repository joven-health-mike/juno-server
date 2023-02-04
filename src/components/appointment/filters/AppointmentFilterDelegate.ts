import { User } from '@prisma/client'
import { Filter, ShowEverythingFilter, ShowNothingFilter } from '../../Filter'
import { DetailedAppointment } from '../appointmentModel'
import { CounselorAppointmentFilter } from './CounselorAppointmentFilter'
import { GuardianAppointmentFilter } from './GuardianAppointmentFilter'
import { SchoolAppointmentFilter } from './SchoolAppointmentFilter'
import { StudentAppointmentFilter } from './StudentAppointmentFilter'

export class AppointmentFilterDelegate {
  get(user: User): Filter<DetailedAppointment> {
    switch (user.role) {
      case 'SYSADMIN':
      case 'JOVEN_ADMIN':
      case 'JOVEN_STAFF':
        return new ShowEverythingFilter<DetailedAppointment>()
      case 'COUNSELOR':
        return new CounselorAppointmentFilter()
      case 'SCHOOL_ADMIN':
      case 'SCHOOL_STAFF':
        return new SchoolAppointmentFilter()
      case 'STUDENT':
        return new StudentAppointmentFilter()
      case 'GUARDIAN':
        return new GuardianAppointmentFilter()
      default:
        return new ShowNothingFilter<DetailedAppointment>()
    }
  }
}
