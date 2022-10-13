import { prismaClient } from '../../database'
import {
  Appointment,
  AppointmentStatus,
  AppointmentType,
  CounselorDetails,
  School,
  User
} from '@prisma/client'
import { AppointmentFilterDelegate } from './filters/AppointmentFilterDelegate'

export interface AppointmentInfo {
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

export const findAllAppointments = async (
  loggedInUser: User
): Promise<Appointment[]> => {
  const allAppointments = await prismaClient.appointment.findMany({
    include: {
      counselor: { include: { user: true } },
      participants: true,
      school: true
    }
  })
  return await filterAppointments(allAppointments, loggedInUser)
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

export const deleteAppointment = async (id: string): Promise<Appointment> => {
  return await prismaClient.appointment.delete({
    where: { id: id }
  })
}

// only return appointments that are related to the logged-in user somehow
const filterAppointments = async (
  appointments: Appointment[],
  loggedInUser: User
): Promise<Appointment[]> => {
  return new AppointmentFilterDelegate()
    .get(loggedInUser)
    .apply(appointments, loggedInUser)
}
