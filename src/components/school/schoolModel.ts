import { prismaClient } from '../../database'
import {
  School,
  SchoolAdminDetails,
  SchoolStaffDetails,
  StudentDetails
} from '@prisma/client'

interface SchoolInfo {
  id?: string
  name?: string
  address?: string
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

export const findAllSchools = async (): Promise<School[]> => {
  return await prismaClient.school.findMany()
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
