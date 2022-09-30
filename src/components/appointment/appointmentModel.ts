import { prismaClient } from '../../database'
import {
  Appointment,
  AppointmentStatus,
  AppointmentType,
  CounselorDetails,
  School,
  User
} from '@prisma/client'

interface AppointmentInfo {
  id?: string
  title?: string
  start?: Date
  end?: Date
  school?: School
  schoolId?: string
  participants?: User[]
  counselor?: CounselorDetails
  counselorId?: string
  type?: AppointmentType
  status?: AppointmentStatus
}

export const createAppointment = async (
  appointmentInfo: AppointmentInfo
): Promise<Appointment> => {
  return await prismaClient.appointment.create({
    data: appointmentInfo as Appointment
  })
}

export const findAllAppointments = async (): Promise<Appointment[]> => {
  return await prismaClient.appointment.findMany({
    include: {
      counselor: { include: { user: true } },
      participants: true,
      school: true
    }
  })
}

export const findAppointmentById = async (
  id: string
): Promise<Appointment | null> => {
  return await prismaClient.appointment.findUnique({
    where: { id },
    include: {
      counselor: { include: { user: true } },
      participants: true
    }
  })
}

export const updateAppointment = async (
  appointmentInfo: AppointmentInfo
): Promise<Appointment> => {
  return await prismaClient.appointment.update({
    data: appointmentInfo as Appointment,
    where: { id: appointmentInfo.id }
  })
}
