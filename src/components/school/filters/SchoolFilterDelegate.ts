import { School, User } from '@prisma/client'
import { Filter, ShowEverythingFilter, ShowNothingFilter } from '../../Filter'
import { CounselorSchoolFilter } from './CounselorSchoolFilter'
import { GuardianSchoolFilter } from './GuardianSchoolFilter'
import { SchoolSchoolFilter } from './SchoolSchoolFilter'
import { StudentSchoolFilter } from './StudentSchoolFilter'

export class SchoolFilterDelegate {
  get(user: User): Filter<School> {
    switch (user.role) {
      case 'SYSADMIN':
      case 'JOVEN_ADMIN':
      case 'JOVEN_STAFF':
        return new ShowEverythingFilter<School>()
      case 'COUNSELOR':
        return new CounselorSchoolFilter()
      case 'SCHOOL_ADMIN':
      case 'SCHOOL_STAFF':
        return new SchoolSchoolFilter()
      case 'STUDENT':
        return new StudentSchoolFilter()
      case 'GUARDIAN':
        return new GuardianSchoolFilter()
      default:
        return new ShowNothingFilter<School>()
    }
  }
}
