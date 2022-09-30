import { PrismaClient, Prisma } from '@prisma/client'
import seedAppointmentsData from './data/appointments'
import seedCounselorDetailsData from './data/counselorDetails'
import seedSchoolsData from './data/schools'
import seedStudentDetailsData from './data/studentDetails'
import seedUsersData from './data/users'

const prisma = new PrismaClient()

async function main() {
  seedDatabaseData()
}

async function seedDatabaseData() {
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
  // CounselorDetails
  await Promise.all(
    seedCounselorDetailsData.map(async counselorDetails =>
      prisma.counselorDetails.upsert({
        where: { id: counselorDetails.id },
        update: {},
        create: counselorDetails as Prisma.CounselorDetailsCreateInput
      })
    )
  )
  // StudentDetails
  await Promise.all(
    seedStudentDetailsData.map(async studentDetails =>
      prisma.studentDetails.upsert({
        where: { id: studentDetails.id },
        update: {},
        create: studentDetails as Prisma.StudentDetailsCreateInput
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
  .catch(async e => {
    await prisma.$disconnect()
    process.exit(1)
  })
