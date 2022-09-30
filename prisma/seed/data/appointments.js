module.exports = [
  {
    id: '0',
    title: 'Student One (Aardvark Academy) - Clinical Therapy',
    start: new Date(),
    end: new Date(),
    counselor: { connect: { id: '0' } },
    participants: { connect: [{ id: '1' }] },
    school: { connect: { id: '0' } },
    type: 'CLINICAL',
    status: 'SCHEDULED'
  }
]
