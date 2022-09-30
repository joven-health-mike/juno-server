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

export const createSchool = async (schoolInfo: SchoolInfo): Promise<School> => {
  return await prismaClient.school.create({
    data: schoolInfo as School
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
    data: schoolInfo as School,
    where: { id: schoolInfo.id }
  })
}
