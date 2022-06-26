import { prismaClient } from '../../database'
import {
  Appointment,
  AppointmentStatus,
  AppointmentType,
  CounselorDetails,
  User
} from '@prisma/client'

interface AppointmentInfo {
  id?: number
  title?: string
  start?: Date
  end?: Date
  participants?: User[]
  counselor?: CounselorDetails
  counselorId?: number
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
  return await prismaClient.appointment.findMany()
}

export const findAppointmentById = async (
  id: number
): Promise<Appointment | null> => {
  return await prismaClient.appointment.findUnique({
    where: { id }
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
