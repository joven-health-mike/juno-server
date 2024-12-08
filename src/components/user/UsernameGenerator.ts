export function generateUsername(firstName: string, lastName: string) {
  return `${firstName}.${lastName}`.slice(0, 15).toLowerCase()
}
