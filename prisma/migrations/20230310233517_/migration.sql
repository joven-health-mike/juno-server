-- CreateEnum
CREATE TYPE "RepeatFrequency" AS ENUM ('DAYS', 'WEEKS', 'MONTHS', 'YEARS');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('JOVEN_ADMIN', 'JOVEN_STAFF', 'SCHOOL_ADMIN', 'SCHOOL_STAFF', 'STUDENT', 'TEACHER', 'GUARDIAN', 'COUNSELOR', 'SYSADMIN', 'UNASSIGNED');

-- CreateEnum
CREATE TYPE "StudentStatus" AS ENUM ('ACTIVE', 'DISCHARGED', 'DELETED');

-- CreateEnum
CREATE TYPE "AppointmentType" AS ENUM ('CLINICAL', 'CONSULTATION', 'EVALUATION', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('SCHEDULED', 'CANCELLED', 'ONGOING', 'FINISHED', 'DELETED');

-- CreateEnum
CREATE TYPE "AppointmentLocation" AS ENUM ('VIRTUAL_SCHOOL', 'VIRTUAL_HOME', 'IN_PERSON', 'UNKNOWN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'UNASSIGNED',
    "email" TEXT,
    "phone" TEXT,
    "docsUrl" TEXT,
    "timeZoneIanaName" TEXT DEFAULT 'America/New_York',
    "counselorRoomLink" TEXT,
    "counselorRoomLink2" TEXT,
    "studentStatus" "StudentStatus",
    "studentAssignedCounselorId" TEXT,
    "studentAssignedSchoolId" TEXT,
    "schoolAdminAssignedSchoolId" TEXT,
    "schoolStaffAssignedSchoolId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "School" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "state" TEXT,
    "city" TEXT,
    "zip" TEXT,
    "primaryEmail" TEXT,
    "primaryPhone" TEXT,
    "docsUrl" TEXT,

    CONSTRAINT "School_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'SCHEDULED',
    "type" "AppointmentType" DEFAULT 'UNKNOWN',
    "location" "AppointmentLocation" DEFAULT 'UNKNOWN',
    "isRecurring" BOOLEAN DEFAULT false,
    "numOccurrences" INTEGER DEFAULT 0,
    "numRepeats" INTEGER DEFAULT 0,
    "frequency" "RepeatFrequency" DEFAULT 'WEEKS',
    "counselorUserId" TEXT,
    "schoolId" TEXT,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_GuardianStudents" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CounselorSchools" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ParticipantAppointment" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "_GuardianStudents_AB_unique" ON "_GuardianStudents"("A", "B");

-- CreateIndex
CREATE INDEX "_GuardianStudents_B_index" ON "_GuardianStudents"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CounselorSchools_AB_unique" ON "_CounselorSchools"("A", "B");

-- CreateIndex
CREATE INDEX "_CounselorSchools_B_index" ON "_CounselorSchools"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ParticipantAppointment_AB_unique" ON "_ParticipantAppointment"("A", "B");

-- CreateIndex
CREATE INDEX "_ParticipantAppointment_B_index" ON "_ParticipantAppointment"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_studentAssignedCounselorId_fkey" FOREIGN KEY ("studentAssignedCounselorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_studentAssignedSchoolId_fkey" FOREIGN KEY ("studentAssignedSchoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_schoolAdminAssignedSchoolId_fkey" FOREIGN KEY ("schoolAdminAssignedSchoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_schoolStaffAssignedSchoolId_fkey" FOREIGN KEY ("schoolStaffAssignedSchoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_counselorUserId_fkey" FOREIGN KEY ("counselorUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GuardianStudents" ADD CONSTRAINT "_GuardianStudents_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GuardianStudents" ADD CONSTRAINT "_GuardianStudents_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CounselorSchools" ADD CONSTRAINT "_CounselorSchools_A_fkey" FOREIGN KEY ("A") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CounselorSchools" ADD CONSTRAINT "_CounselorSchools_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ParticipantAppointment" ADD CONSTRAINT "_ParticipantAppointment_A_fkey" FOREIGN KEY ("A") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ParticipantAppointment" ADD CONSTRAINT "_ParticipantAppointment_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
