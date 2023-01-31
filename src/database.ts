// Database
// Creates a connection to the application's database
import { PrismaClient } from '.prisma/client'

const DATABASE_URL = `postgresql://postgres:postgres@${process.env.HOSTNAME}:${process.env.HOSTNAME}/juno_dev`

// Exports the Prisma client that can be used by any file that imports it.
export const prismaClient = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL
    }
  }
})
