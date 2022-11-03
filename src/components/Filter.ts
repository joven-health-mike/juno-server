import { User } from '@prisma/client'

export interface Filter<T> {
  apply: (allItems: T[], reference: User) => Promise<T[]>
}

export class ShowEverythingFilter<T> implements Filter<T> {
  async apply(allItems: T[]): Promise<T[]> {
    return allItems
  }
}

export class ShowNothingFilter<T> implements Filter<T> {
  async apply(): Promise<T[]> {
    return []
  }
}
