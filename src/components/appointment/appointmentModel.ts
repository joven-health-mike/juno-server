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

const getAppointmentFromAppointmentInfo = (
  appointmentInfo: AppointmentInfo
) => {
  return {
    id: appointmentInfo.id === '-1' ? undefined : appointmentInfo.id,
    title: appointmentInfo.title,
    start: appointmentInfo.start,
    end: appointmentInfo.end,
    school: appointmentInfo.school,
    schoolId: appointmentInfo.schoolId,
    counselor: appointmentInfo.counselor,
    counselorId: appointmentInfo.counselorId,
    type: appointmentInfo.type,
    status: appointmentInfo.status,
    participants: getParticipantConnectionsFromAppointmentInfo(appointmentInfo)
  }
}

const getParticipantConnectionsFromAppointmentInfo = (
  appointmentInfo: AppointmentInfo
) => {
  const result: any = {}
  result.connect = []

  for (const participant of appointmentInfo.participants) {
    result.connect.push({
      id: participant.id
    })
  }

  return result
}

export const createAppointment = async (
  appointmentInfo: AppointmentInfo
): Promise<Appointment> => {
  return await prismaClient.appointment.create({
    data: getAppointmentFromAppointmentInfo(appointmentInfo) as Appointment,
    include: { participants: true, counselor: true, school: true }
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
    data: getAppointmentFromAppointmentInfo(appointmentInfo) as Appointment,
    where: { id: appointmentInfo.id }
  })
}
