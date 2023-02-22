import { Filter, ShowEverythingFilter, ShowNothingFilter } from '../../Filter'
import { DetailedUser } from '../userModel'
import { CounselorUserFilter } from './CounselorUserFilter'
import { GuardianUserFilter } from './GuardianUserFilter'
import { SchoolUserFilter } from './SchoolUserFilter'
import { StudentUserFilter } from './StudentUserFilter'

export class UserFilterDelegate {
  get(user: DetailedUser): Filter<DetailedUser, DetailedUser> {
    switch (user.role) {
      case 'SYSADMIN':
      case 'JOVEN_ADMIN':
      case 'JOVEN_STAFF':
        return new ShowEverythingFilter<DetailedUser, DetailedUser>()
      case 'COUNSELOR':
        return new CounselorUserFilter()
      case 'SCHOOL_ADMIN':
      case 'SCHOOL_STAFF':
        return new SchoolUserFilter()
      case 'STUDENT':
        return new StudentUserFilter()
      case 'GUARDIAN':
        return new GuardianUserFilter()
      default:
        return new ShowNothingFilter<DetailedUser, DetailedUser>()
    }
  }
}
