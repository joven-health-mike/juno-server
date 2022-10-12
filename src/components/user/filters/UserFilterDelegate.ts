import { User } from '@prisma/client'
import { Filter, ShowEverythingFilter, ShowNothingFilter } from '../../Filter'
import { CounselorUserFilter } from './CounselorUserFilter'
import { GuardianUserFilter } from './GuardianUserFilter'
import { SchoolUserFilter } from './SchoolUserFilter'
import { StudentUserFilter } from './StudentUserFilter'

export class UserFilterDelegate {
  get(user: User): Filter<User> {
    switch (user.role) {
      case 'SYSADMIN':
      case 'JOVEN_ADMIN':
      case 'JOVEN_STAFF':
        return new ShowEverythingFilter<User>()
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
        return new ShowNothingFilter<User>()
    }
  }
}
