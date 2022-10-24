const currentDate = new Date()
const currentDatePlus30Mins = new Date(currentDate.getTime() + 30 * 60 * 1000)

module.exports = [
  {
    id: 'd148dbd0-325d-4eed-8819-66bde5d35364',
    title: 'Bolat F (Aardvark Academy) - CLINICAL',
    start: currentDate,
    end: currentDatePlus30Mins,
    isRecurring: false,
    counselor: { connect: { id: 'd6d029d7-34e2-44ad-8fee-fc3e91c374ed' } },
    participants: { connect: [{ id: '722f30bf-c589-4e09-9b61-4c3c9e08b957' }] },
    school: { connect: { id: 'a7e56e1c-f1c2-4bf9-a3fd-9fdef3fb87df' } },
    type: 'CLINICAL',
    status: 'SCHEDULED'
  },
  {
    id: '1d55fc1d-8838-46a7-a94d-8dd56a5e6e7d',
    title: 'Francois C (Aardvark Academy) - EVALUATION',
    start: currentDate,
    end: currentDatePlus30Mins,
    counselor: { connect: { id: 'cb5239fe-6d3a-41b7-b192-b0d6fa5e6aa3' } },
    participants: {
      connect: [
        { id: '6f466fc1-6b7f-46a0-a0a9-c2a6a3808e1a' },
        { id: '3b5c063c-4c5f-456d-94da-69c93e9ed18d' },
        { id: '8a1b8490-22ce-4ec5-9aeb-b33c2eff582a' }
      ]
    },
    school: { connect: { id: 'a7e56e1c-f1c2-4bf9-a3fd-9fdef3fb87df' } },
    type: 'EVALUATION',
    status: 'SCHEDULED'
  },
  {
    id: '4276c55f-0e03-48ac-a54d-aedbe9816c81',
    title: 'Karsten A (Iguana Institute) - CONSULTATION',
    start: currentDate,
    end: currentDatePlus30Mins,
    counselor: { connect: { id: '5cc83e4f-2be8-4d29-b875-b85df62cdd7b' } },
    participants: { connect: [{ id: 'fb0ee989-dcb8-4b4f-bcc0-b9983c02b69c' }] },
    school: { connect: { id: '5ac1c4ab-725b-4a5c-bb0a-e3ab5c882aca' } },
    type: 'CONSULTATION',
    status: 'SCHEDULED'
  }
]
