import { PrismaClient, Prisma } from '@prisma/client'
import seedAppointmentsData from './data/appointments'
import seedSchoolsData from './data/schools'
import seedUsersData from './data/users'

const prisma = new PrismaClient()

async function main() {
  seedDatabaseData()
}

async function seedDatabaseData() {
  // Schools
  await Promise.all(
    seedSchoolsData.map(async school =>
      prisma.school.upsert({
        where: { id: school.id },
        update: {},
        create: school as Prisma.SchoolCreateInput
      })
    )
  )
  // Users
  await Promise.all(
    seedUsersData.map(async user =>
      prisma.user.upsert({
        where: { id: user.id },
        update: {},
        create: user as Prisma.UserCreateInput
      })
    )
  )
  // Appointments
  await Promise.all(
    seedAppointmentsData.map(async appointments =>
      prisma.appointment.upsert({
        where: { id: appointments.id },
        update: {},
        create: appointments as Prisma.AppointmentCreateInput
      })
    )
  )
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async () => {
    await prisma.$disconnect()
    process.exit(1)
  })
