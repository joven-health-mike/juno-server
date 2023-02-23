import userData from './userData.json'

export const mockUser = userData

// export const findUserById = jest.fn().mockImplementation().mockResolvedValue(mockUser)

export const findUserById = jest.fn(() => Promise.resolve(mockUser))
