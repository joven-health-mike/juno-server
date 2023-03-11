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
    seedAppointmentsData.map(async appointment =>
      prisma.appointment.upsert({
        where: { id: appointment.id },
        update: {},
        create: appointment as Prisma.AppointmentCreateInput
      })
    )
  )

  // assign students to Jesse
  await prisma.user.update({
    where: { id: '9081ed50-3b6a-4082-b514-ff04a874f7e8' },
    data: {
      counselorAssignedStudents: {
        connect: [
          { id: '64ea8a3a-2934-418b-8ac9-48892d7b2570' },
          { id: '24d59901-6dd8-4865-b871-292863e83d6f' },
          { id: '663edb77-62f1-4998-ad2e-badb80a9cbcf' }
        ]
      }
    }
  })

  // assign students to Patricia
  await prisma.user.update({
    where: { id: '6797649b-aebf-45a2-892a-44e831283802' },
    data: {
      counselorAssignedStudents: {
        connect: [
          { id: '135a7e88-4fbf-49d2-b332-66dde1965a7f' },
          { id: 'fb0ee989-dcb8-4b4f-bcc0-b9983c02b69c' },
          { id: '6f466fc1-6b7f-46a0-a0a9-c2a6a3808e1a' }
        ]
      }
    }
  })

  // assign students to Hephzibah
  await prisma.user.update({
    where: { id: 'd80602a2-8419-49b1-b6ac-5690628d0e0e' },
    data: {
      counselorAssignedStudents: {
        connect: [
          { id: '722f30bf-c589-4e09-9b61-4c3c9e08b957' },
          { id: '9281fd50-3b6a-4082-b514-ff04a874f7e8' }
        ]
      }
    }
  })

  // assign students to Aaron
  await prisma.user.update({
    where: { id: 'e68b59ae-c2a3-4cc5-b321-f8d70ac7602e' },
    data: {
      guardianStudents: {
        connect: [{ id: '722f30bf-c589-4e09-9b61-4c3c9e08b957' }]
      }
    }
  })

  // assign students to Amanda
  await prisma.user.update({
    where: { id: '8a6c3f49-2bc1-4265-8f6f-736ee63e52ec' },
    data: {
      guardianStudents: {
        connect: [{ id: '722f30bf-c589-4e09-9b61-4c3c9e08b957' }]
      }
    }
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async () => {
    await prisma.$disconnect()
    process.exit(1)
  })
