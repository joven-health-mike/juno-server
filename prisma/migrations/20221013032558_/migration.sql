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
    "id" TEXT NOT NULL,
    "email" TEXT,
    "username" TEXT NOT NULL,
    "phone" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "docsUrl" TEXT,
    "timeZoneOffset" INTEGER,
    "role" "Role" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SysAdminDetails" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "SysAdminDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JovenAdminDetails" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "JovenAdminDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JovenStaffDetails" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "JovenStaffDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CounselorDetails" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roomLink" TEXT NOT NULL,

    CONSTRAINT "CounselorDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchoolAdminDetails" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "assignedSchoolId" TEXT NOT NULL,

    CONSTRAINT "SchoolAdminDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchoolStaffDetails" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "assignedSchoolId" TEXT NOT NULL,

    CONSTRAINT "SchoolStaffDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuardianDetails" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "GuardianDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentDetails" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "assignedSchoolId" TEXT NOT NULL,
    "assignedCounselorId" TEXT NOT NULL,
    "status" "StudentStatus" NOT NULL,

    CONSTRAINT "StudentDetails_pkey" PRIMARY KEY ("id")
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

    CONSTRAINT "School_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "counselorId" TEXT NOT NULL,
    "type" "AppointmentType" NOT NULL,
    "status" "AppointmentStatus" NOT NULL,
    "schoolId" TEXT NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CounselorSchool" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_GuardianDetailsToStudentDetails" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ParticipantAppointment" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
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
CREATE UNIQUE INDEX "JovenAdminDetails_userId_key" ON "JovenAdminDetails"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "JovenStaffDetails_userId_key" ON "JovenStaffDetails"("userId");

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
CREATE UNIQUE INDEX "_CounselorSchool_AB_unique" ON "_CounselorSchool"("A", "B");

-- CreateIndex
CREATE INDEX "_CounselorSchool_B_index" ON "_CounselorSchool"("B");

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
ALTER TABLE "JovenAdminDetails" ADD CONSTRAINT "JovenAdminDetails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JovenStaffDetails" ADD CONSTRAINT "JovenStaffDetails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
ALTER TABLE "StudentDetails" ADD CONSTRAINT "StudentDetails_assignedSchoolId_fkey" FOREIGN KEY ("assignedSchoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentDetails" ADD CONSTRAINT "StudentDetails_assignedCounselorId_fkey" FOREIGN KEY ("assignedCounselorId") REFERENCES "CounselorDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_counselorId_fkey" FOREIGN KEY ("counselorId") REFERENCES "CounselorDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CounselorSchool" ADD CONSTRAINT "_CounselorSchool_A_fkey" FOREIGN KEY ("A") REFERENCES "CounselorDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CounselorSchool" ADD CONSTRAINT "_CounselorSchool_B_fkey" FOREIGN KEY ("B") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GuardianDetailsToStudentDetails" ADD CONSTRAINT "_GuardianDetailsToStudentDetails_A_fkey" FOREIGN KEY ("A") REFERENCES "GuardianDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GuardianDetailsToStudentDetails" ADD CONSTRAINT "_GuardianDetailsToStudentDetails_B_fkey" FOREIGN KEY ("B") REFERENCES "StudentDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ParticipantAppointment" ADD CONSTRAINT "_ParticipantAppointment_A_fkey" FOREIGN KEY ("A") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ParticipantAppointment" ADD CONSTRAINT "_ParticipantAppointment_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
