import { prismaClient } from '../../database'
import {
  School,
  SchoolAdminDetails,
  SchoolStaffDetails,
  StudentDetails,
  User
} from '@prisma/client'
import { SchoolFilterDelegate } from './filters/SchoolFilterDelegate'

interface SchoolInfo {
  id?: string
  name?: string
  address?: string
  city?: string
  state?: string
  zip?: string
  primaryEmail?: string
  primaryPhone?: string
  schoolAdmins?: SchoolAdminDetails[]
  schoolStaff?: SchoolStaffDetails[]
  students?: StudentDetails[]
}

const getSchoolFromSchoolInfo = (schoolInfo: SchoolInfo) => {
  return {
    id: schoolInfo.id === '-1' ? undefined : schoolInfo.id,
    name: schoolInfo.name,
    address: schoolInfo.address,
    city: schoolInfo.city,
    state: schoolInfo.state,
    zip: schoolInfo.zip,
    primaryEmail: schoolInfo.primaryEmail,
    primaryPhone: schoolInfo.primaryPhone,
    schoolAdmins: schoolInfo.schoolAdmins,
    schoolStaff: schoolInfo.schoolStaff,
    students: schoolInfo.students
  }
}

export const createSchool = async (schoolInfo: SchoolInfo): Promise<School> => {
  return await prismaClient.school.create({
    data: getSchoolFromSchoolInfo(schoolInfo) as School
  })
}

export const findAllSchools = async (loggedInUser: User): Promise<School[]> => {
  const allSchools = await prismaClient.school.findMany()
  return await filterSchools(allSchools, loggedInUser)
}

export const findSchoolById = async (id: string): Promise<School | null> => {
  return await prismaClient.school.findUnique({
    where: { id }
  })
}

export const updateSchool = async (schoolInfo: SchoolInfo): Promise<School> => {
  return await prismaClient.school.update({
    data: getSchoolFromSchoolInfo(schoolInfo) as School,
    where: { id: schoolInfo.id }
  })
}

// only return users that are related to the logged-in user somehow
const filterSchools = async (
  schools: School[],
  loggedInUser: User
): Promise<School[]> => {
  return new SchoolFilterDelegate()
    .get(loggedInUser)
    .apply(schools, loggedInUser)
}
