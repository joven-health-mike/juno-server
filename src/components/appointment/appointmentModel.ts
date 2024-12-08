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

export type DetailedAppointment = Appointment & { participants: User[] }

export interface AppointmentInfo {
  id?: string
  title?: string
  start?: Date
  end?: Date
  isRecurring?: boolean
  numOccurrences?: number
  numRepeats: number
  frequency?: string
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
    isRecurring: appointmentInfo.isRecurring,
    numOccurrences: appointmentInfo.numOccurrences,
    numRepeats: appointmentInfo.numRepeats,
    frequency: appointmentInfo.frequency,
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
  return await prismaClient.appointment.create({
    data: getAppointmentFromAppointmentInfo(appointmentInfo) as Appointment,
    include: { participants: true, counselor: true, school: true }
  })
}

export const createRecurringAppointments = async (
  appointmentInfo: AppointmentInfo,
  originalAppointment: Appointment
): Promise<Appointment[]> => {
  const openRequests: Promise<Appointment>[] = []
  const originalStartDate = originalAppointment.start
  const originalEndDate = originalAppointment.end
  const numOccurrences = appointmentInfo.numOccurrences
  const occurrenceRepeatFrequency = appointmentInfo.frequency
  const occurrenceRepeatNumber = appointmentInfo.numRepeats
  let loopStartDate: Date = originalStartDate,
    loopEndDate: Date = originalEndDate
  for (let i = 0; i < numOccurrences - 1; i++) {
    loopStartDate = new Date(loopStartDate)
    loopEndDate = new Date(loopEndDate)
    switch (occurrenceRepeatFrequency) {
      case 'DAYS':
        loopStartDate.setDate(loopStartDate.getDate() + occurrenceRepeatNumber)
        loopEndDate.setDate(loopEndDate.getDate() + occurrenceRepeatNumber)
        break
      case 'WEEKS':
        loopStartDate.setDate(
          loopStartDate.getDate() + occurrenceRepeatNumber * 7
        )
        loopEndDate.setDate(loopEndDate.getDate() + occurrenceRepeatNumber * 7)
        break
      case 'MONTHS':
        loopStartDate = new Date(
          loopStartDate.setMonth(
            loopStartDate.getMonth() + occurrenceRepeatNumber
          )
        )
        loopEndDate = new Date(
          loopEndDate.setMonth(loopEndDate.getMonth() + occurrenceRepeatNumber)
        )
        break
      case 'YEARS':
        loopStartDate = new Date(
          loopStartDate.setFullYear(
            loopStartDate.getFullYear() + occurrenceRepeatNumber
          )
        )
        loopEndDate = new Date(
          loopEndDate.setFullYear(
            loopEndDate.getFullYear() + occurrenceRepeatNumber
          )
        )
        break
    }

    const appointment = {
      ...appointmentInfo,
      id: undefined, // we want a new ID for each appointment, clear the old one
      start: loopStartDate,
      end: loopEndDate
    }

    openRequests.push(
      prismaClient.appointment.create({
        data: getAppointmentFromAppointmentInfo(appointment) as Appointment
      })
    )
  }

  return Promise.all(openRequests)
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
