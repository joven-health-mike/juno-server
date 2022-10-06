module.exports = [
  {
    id: '0',
    user: { connect: { id: '14' } },
    students: { connect: [{ id: '1' }] }
  },
  {
    id: '1',
    user: { connect: { id: '15' } },
    students: { connect: [{ id: '1' }] }
  }
]
