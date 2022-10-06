import { User } from '@prisma/client'
import { CounselorFilter } from './CounselorFilter'
import { GuardianFilter } from './GuardianFilter'
import { SchoolFilter } from './SchoolFilter'
import { StudentFilter } from './StudentFilter'

export interface Filter<T> {
  apply: (allItems: T[], reference: T) => Promise<T[]>
}

class ShowEverythingFilter implements Filter<User> {
  async apply(allItems: User[]): Promise<User[]> {
    return allItems
  }
}

class ShowNothingFilter implements Filter<User> {
  async apply(): Promise<User[]> {
    return []
  }
}

export class FilterDelegate {
  get(user: User): Filter<User> {
    switch (user.role) {
      case 'SYSADMIN':
      case 'JOVEN_ADMIN':
      case 'JOVEN_STAFF':
        return new ShowEverythingFilter()
      case 'COUNSELOR':
        return new CounselorFilter()
      case 'SCHOOL_ADMIN':
      case 'SCHOOL_STAFF':
        return new SchoolFilter()
      case 'STUDENT':
        return new StudentFilter()
      case 'GUARDIAN':
        return new GuardianFilter()
      default:
        return new ShowNothingFilter()
    }
  }
}
