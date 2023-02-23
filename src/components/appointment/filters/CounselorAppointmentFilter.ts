import { Filter } from '../../Filter'
import { DetailedUser } from '../../user/userModel'
import { DetailedAppointment } from '../appointmentModel'

export class CounselorAppointmentFilter
  implements Filter<DetailedAppointment, DetailedUser>
{
  async apply(
    allItems: DetailedAppointment[],
    reference: DetailedUser
  ): Promise<DetailedAppointment[]> {
    return allItems.filter(appointment => {
      appointment.counselorUserId === reference.id
    })
  }
}
