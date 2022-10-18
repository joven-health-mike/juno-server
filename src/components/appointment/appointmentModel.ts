import { prismaClient } from '../../database'
import {
  Appointment,
  AppointmentLocation,
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
  isRecurring?: boolean
  numOccurrences?: number
  numRepeats: number
  frequency?: string
  school?: School
  schoolId?: string
  participants?: User[]
  counselor?: CounselorDetails
  counselorId?: string
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
    counselor: appointmentInfo.counselor,
    counselorId:
      appointmentInfo.counselorId === '-1'
        ? undefined
        : appointmentInfo.counselorId,
    type: appointmentInfo.type,
    status: appointmentInfo.status,
    location: appointmentInfo.location,
    participants: getParticipantConnectionsFromAppointmentInfo(appointmentInfo)
  } as Appointment
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
  const appointments: Appointment[] = []
  for (let i = 0; i < numOccurrences - 1; i++) {
    console.log('loopStartDate: ' + loopStartDate.toISOString())
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
    console.log('loopStartDate(post-op): ' + loopStartDate.toISOString())

    const appointment = {
      ...appointmentInfo,
      id: undefined, // we want a new ID for each appointment, clear the old one
      participants: undefined,
      counselor: undefined,
      school: undefined,
      start: loopStartDate,
      end: loopEndDate
    } as Appointment
    appointments.push(appointment)
    openRequests.push(prismaClient.appointment.create({ data: appointment }))
  }

  return Promise.all(openRequests)
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
      school: true,
      participants: true
    }
  })
}

export const updateAppointment = async (
  appointmentInfo: AppointmentInfo
): Promise<Appointment> => {
  appointmentInfo.counselor = undefined
  appointmentInfo.school = undefined
  appointmentInfo.participants = undefined
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
