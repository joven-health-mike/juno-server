import { prismaClient } from '../../database'
import { Appointment } from '@prisma/client'

interface AppointmentInfo {
  id?: number
  title?: string
  start?: string
  end?: string
  studentId?: number
  counselorId?: number
}

export const createAppointment = async (
  appointmentInfo: AppointmentInfo
): Promise<Appointment> => {
  return await prismaClient.appointment.create({
    data: appointmentInfo as Appointment
  })
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
