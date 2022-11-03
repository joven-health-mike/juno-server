export const mockAppointment = {
  id: 1,
  email: 'jon.smith@gmail.com',
  name: 'Jon Smith'
}

// export const findUserById = jest.fn().mockImplementation().mockResolvedValue(mockUser)

export const findAppointmentById = jest.fn(() =>
  Promise.resolve(mockAppointment)
)
