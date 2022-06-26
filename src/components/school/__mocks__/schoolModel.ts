export const mockSchool = {
  id: 2,
  name: 'Aardvark Academy',
  address: '123 Aardvark St',
  state: 'CO',
  zip: '80013',
  primaryEmail: 'aardvark-academy@jovenhealth.com',
  primaryPhone: '123-456-7890'
}

// export const findUserById = jest.fn().mockImplementation().mockResolvedValue(mockUser)

export const findSchoolById = jest.fn(() => Promise.resolve(mockSchool))
