// Database
// Creates a connection to the application's database
import { PrismaClient } from '.prisma/client'

// Exports the Prisma client that can be used by any file that imports it.
export const prismaClient = new PrismaClient()
