import { prismaClient } from '../../database'
import {
  Appointment,
  AppointmentLocation,
  AppointmentStatus,
  AppointmentType,
  School,
  User
} from '@prisma/client'
import { AppointmentFilterDelegate } from './filters/AppointmentFilterDelegate'
import { DetailedUser } from '../user/userModel'
import { randomUUID } from 'crypto'

export type DetailedAppointment = Appointment & { participants: User[] }

export interface AppointmentInfo {
  id?: string
  title?: string
  start?: Date
  end?: Date
  isSeries?: boolean
  seriesId?: string
  seriesRule?: string
  seriesExceptions?: string[]
  seriesProtoId?: string
  school?: School
  schoolId?: string
  counselor?: User
  counselorUserId?: string
  participants?: User[]
  type?: AppointmentType
  status?: AppointmentStatus
  location?: AppointmentLocation
}

const getAppointmentFromAppointmentInfo = (
  appointmentInfo: AppointmentInfo
) => {
  return {
    id: appointmentInfo.id === '-1' ? undefined : appointmentInfo.id,
    title: appointmentInfo.title,
    start: appointmentInfo.start,
    end: appointmentInfo.end,
    isSeries: appointmentInfo.isSeries,
    seriesId: appointmentInfo.seriesId,
    seriesRule: appointmentInfo.seriesRule,
    seriesExceptions: appointmentInfo.seriesExceptions,
    seriesProtoId: appointmentInfo.seriesProtoId,
    school: appointmentInfo.school,
    schoolId:
      appointmentInfo.schoolId === '-1' ? undefined : appointmentInfo.schoolId,
    counselorUserId:
      appointmentInfo.counselorUserId === '-1'
        ? undefined
        : appointmentInfo.counselorUserId,
    type: appointmentInfo.type,
    status: appointmentInfo.status,
    location: appointmentInfo.location,
    participants: getParticipantConnectionsFromAppointmentInfo(appointmentInfo)
  } as Appointment
}

const getParticipantConnectionsFromAppointmentInfo = (
  appointmentInfo: AppointmentInfo
) => {
  if (typeof appointmentInfo.participants === 'undefined') {
    return undefined
  }
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
  const appointmentId = randomUUID()
  appointmentInfo.id = appointmentId
  if (appointmentInfo.isSeries) {
    appointmentInfo.seriesId = randomUUID()
    appointmentInfo.seriesProtoId = appointmentId
  }

  return await prismaClient.appointment.create({
    data: getAppointmentFromAppointmentInfo(appointmentInfo) as Appointment,
    include: { participants: true, counselor: true, school: true }
  })
}

export const findAllAppointments = async (
  loggedInUser: DetailedUser
): Promise<DetailedAppointment[]> => {
  const allAppointments = await prismaClient.appointment.findMany({
    include: {
      counselor: true,
      participants: true,
      school: true
    }
  })
  return await filterAppointments(allAppointments, loggedInUser)
}

export const findAppointmentById = async (
  id: string
): Promise<DetailedAppointment | null> => {
  return await prismaClient.appointment.findUnique({
    where: { id },
    include: {
      counselor: true,
      school: true,
      participants: true
    }
  })
}

export const updateAppointment = async (
  appointmentInfo: AppointmentInfo
): Promise<Appointment> => {
  appointmentInfo.school = undefined
  appointmentInfo.participants = undefined
  return await prismaClient.appointment.update({
    data: getAppointmentFromAppointmentInfo(appointmentInfo) as Appointment,
    where: { id: appointmentInfo.id },
    include: {
      counselor: true,
      school: true,
      participants: true
    }
  })
}

export const deleteAppointment = async (id: string): Promise<Appointment> => {
  return await prismaClient.appointment.delete({
    where: { id: id }
  })
}

// only return appointments that are related to the logged-in user somehow
const filterAppointments = async (
  appointments: DetailedAppointment[],
  loggedInUser: DetailedUser
): Promise<DetailedAppointment[]> => {
  return new AppointmentFilterDelegate()
    .get(loggedInUser)
    .apply(appointments, loggedInUser)
}
