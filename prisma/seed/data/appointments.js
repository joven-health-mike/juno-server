module.exports = [
  {
    id: '0',
    title: 'Bolat Fairbairn (Aardvark Academy) - Clinical Therapy',
    start: new Date(),
    end: new Date(),
    counselor: { connect: { id: '4' } },
    participants: { connect: [{ id: '5' }] },
    school: { connect: { id: '0' } },
    type: 'CLINICAL',
    status: 'SCHEDULED'
  },
  {
    id: '1',
    title: 'Francois Chaves (Aardvark Academy) - Evaluation',
    start: new Date(),
    end: new Date(),
    counselor: { connect: { id: '3' } },
    participants: { connect: [{ id: '6' }, { id: '12' }, { id: '13' }] },
    school: { connect: { id: '0' } },
    type: 'EVALUATION',
    status: 'SCHEDULED'
  },
  {
    id: '2',
    title: 'Karsten Alger (Iguana Institute) - Consultation',
    start: new Date(),
    end: new Date(),
    counselor: { connect: { id: '2' } },
    participants: { connect: [{ id: '6' }] },
    school: { connect: { id: '1' } },
    type: 'CONSULTATION',
    status: 'SCHEDULED'
  }
]
