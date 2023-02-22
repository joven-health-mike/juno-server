export interface Filter<T, U> {
  apply: (allItems: T[], reference: U) => Promise<T[]>
}

export class ShowEverythingFilter<T, U> implements Filter<T, U> {
  async apply(allItems: T[]): Promise<T[]> {
    return allItems
  }
}

export class ShowNothingFilter<T, U> implements Filter<T, U> {
  async apply(): Promise<T[]> {
    return []
  }
}
