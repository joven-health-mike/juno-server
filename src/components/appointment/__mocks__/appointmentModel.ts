import appointmentData from './appointmentData.json'

export const mockAppointment = appointmentData

// export const findUserById = jest.fn().mockImplementation().mockResolvedValue(mockUser)

export const findAppointmentById = jest.fn(() =>
  Promise.resolve(mockAppointment)
)
