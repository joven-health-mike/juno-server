-- CreateEnum
CREATE TYPE "Role" AS ENUM ('JOVEN_ADMIN', 'JOVEN_STAFF', 'SCHOOL_ADMIN', 'SCHOOL_STAFF', 'STUDENT', 'GUARDIAN', 'COUNSELOR', 'SYSADMIN');

-- CreateEnum
CREATE TYPE "StudentStatus" AS ENUM ('ACTIVE', 'DISCHARGED');

-- CreateEnum
CREATE TYPE "AppointmentType" AS ENUM ('CLINICAL', 'CONSULTATION', 'EVALUATION');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('SCHEDULED', 'CANCELLED', 'ONGOING', 'FINISHED', 'DELETED');

-- CreateEnum
CREATE TYPE "AppointmentLocation" AS ENUM ('VIRTUAL_SCHOOL', 'VIRTUAL_HOME', 'IN_PERSON');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT,
    "username" TEXT NOT NULL,
    "phone" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "docsUrl" TEXT,
    "timeZoneOffset" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SysAdminDetails" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "SysAdminDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CounselorDetails" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "roomLink" TEXT NOT NULL,

    CONSTRAINT "CounselorDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchoolAdminDetails" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "assignedSchoolId" INTEGER NOT NULL,

    CONSTRAINT "SchoolAdminDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchoolStaffDetails" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "assignedSchoolId" INTEGER NOT NULL,

    CONSTRAINT "SchoolStaffDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuardianDetails" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "GuardianDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentDetails" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "assignedSchoolId" INTEGER NOT NULL,
    "assignedCounselorId" INTEGER NOT NULL,
    "status" "StudentStatus" NOT NULL,

    CONSTRAINT "StudentDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "School" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "state" TEXT,
    "zip" TEXT,
    "primaryEmail" TEXT,
    "primaryPhone" TEXT,

    CONSTRAINT "School_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "counselorId" INTEGER NOT NULL,
    "type" "AppointmentType" NOT NULL,
    "status" "AppointmentStatus" NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_GuardianDetailsToStudentDetails" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ParticipantAppointment" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "SysAdminDetails_userId_key" ON "SysAdminDetails"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CounselorDetails_userId_key" ON "CounselorDetails"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SchoolAdminDetails_userId_key" ON "SchoolAdminDetails"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SchoolStaffDetails_userId_key" ON "SchoolStaffDetails"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "GuardianDetails_userId_key" ON "GuardianDetails"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentDetails_userId_key" ON "StudentDetails"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "_GuardianDetailsToStudentDetails_AB_unique" ON "_GuardianDetailsToStudentDetails"("A", "B");

-- CreateIndex
CREATE INDEX "_GuardianDetailsToStudentDetails_B_index" ON "_GuardianDetailsToStudentDetails"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ParticipantAppointment_AB_unique" ON "_ParticipantAppointment"("A", "B");

-- CreateIndex
CREATE INDEX "_ParticipantAppointment_B_index" ON "_ParticipantAppointment"("B");

-- AddForeignKey
ALTER TABLE "SysAdminDetails" ADD CONSTRAINT "SysAdminDetails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CounselorDetails" ADD CONSTRAINT "CounselorDetails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolAdminDetails" ADD CONSTRAINT "SchoolAdminDetails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolAdminDetails" ADD CONSTRAINT "SchoolAdminDetails_assignedSchoolId_fkey" FOREIGN KEY ("assignedSchoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolStaffDetails" ADD CONSTRAINT "SchoolStaffDetails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolStaffDetails" ADD CONSTRAINT "SchoolStaffDetails_assignedSchoolId_fkey" FOREIGN KEY ("assignedSchoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuardianDetails" ADD CONSTRAINT "GuardianDetails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentDetails" ADD CONSTRAINT "StudentDetails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentDetails" ADD CONSTRAINT "StudentDetails_assignedCounselorId_fkey" FOREIGN KEY ("assignedCounselorId") REFERENCES "CounselorDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentDetails" ADD CONSTRAINT "StudentDetails_assignedSchoolId_fkey" FOREIGN KEY ("assignedSchoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_counselorId_fkey" FOREIGN KEY ("counselorId") REFERENCES "CounselorDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GuardianDetailsToStudentDetails" ADD CONSTRAINT "_GuardianDetailsToStudentDetails_A_fkey" FOREIGN KEY ("A") REFERENCES "GuardianDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GuardianDetailsToStudentDetails" ADD CONSTRAINT "_GuardianDetailsToStudentDetails_B_fkey" FOREIGN KEY ("B") REFERENCES "StudentDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ParticipantAppointment" ADD CONSTRAINT "_ParticipantAppointment_A_fkey" FOREIGN KEY ("A") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ParticipantAppointment" ADD CONSTRAINT "_ParticipantAppointment_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
