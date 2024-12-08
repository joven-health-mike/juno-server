import schoolData from './schoolData.json'

export const mockSchool = schoolData

// export const findUserById = jest.fn().mockImplementation().mockResolvedValue(mockUser)

export const findSchoolById = jest.fn(() => Promise.resolve(mockSchool))
