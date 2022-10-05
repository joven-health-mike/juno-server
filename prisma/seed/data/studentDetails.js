module.exports = [
  {
    id: '0',
    user: { connect: { id: '5' } },
    status: 'ACTIVE',
    assignedSchool: { connect: { id: '0' } },
    assignedCounselor: { connect: { id: '4' } }
  },
  {
    id: '1',
    user: { connect: { id: '6' } },
    status: 'ACTIVE',
    assignedSchool: { connect: { id: '0' } },
    assignedCounselor: { connect: { id: '0' } }
  },
  {
    id: '2',
    user: { connect: { id: '7' } },
    status: 'ACTIVE',
    assignedSchool: { connect: { id: '1' } },
    assignedCounselor: { connect: { id: '2' } }
  },
  {
    id: '3',
    user: { connect: { id: '8' } },
    status: 'ACTIVE',
    assignedSchool: { connect: { id: '1' } },
    assignedCounselor: { connect: { id: '1' } }
  },
  {
    id: '4',
    user: { connect: { id: '9' } },
    status: 'ACTIVE',
    assignedSchool: { connect: { id: '2' } },
    assignedCounselor: { connect: { id: '0' } }
  },
  {
    id: '5',
    user: { connect: { id: '10' } },
    status: 'ACTIVE',
    assignedSchool: { connect: { id: '3' } },
    assignedCounselor: { connect: { id: '0' } }
  },
  {
    id: '6',
    user: { connect: { id: '11' } },
    status: 'ACTIVE',
    assignedSchool: { connect: { id: '3' } },
    assignedCounselor: { connect: { id: '3' } }
  }
]
