import { User } from '@prisma/client'
import { CounselorFilter } from './CounselorFilter'

export interface Filter<T> {
  apply: (allItems: T[], reference: T) => Promise<T[]>
}

export class DoNothingFilter implements Filter<User> {
  async apply(allItems: User[]): Promise<User[]> {
    return allItems
  }
}

export class FilterDelegate {
  get(user: User): Filter<User> {
    switch (user.role) {
      case 'SYSADMIN':
      case 'JOVEN_ADMIN':
      case 'JOVEN_STAFF':
        return new DoNothingFilter()
      case 'COUNSELOR':
        return new CounselorFilter()
    }
  }
}
