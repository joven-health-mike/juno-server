export const mockUser = {
  id: 1,
  email: 'jon.smith@gmail.com',
  name: 'Jon Smith',
}

// export const findUserById = jest.fn().mockImplementation().mockResolvedValue(mockUser)

export const findUserById = jest.fn(() => Promise.resolve(mockUser))