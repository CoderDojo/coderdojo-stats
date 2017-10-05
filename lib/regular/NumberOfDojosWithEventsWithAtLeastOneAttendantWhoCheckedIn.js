import { append } from '../util';

export default async function NumberOfDojosWithEventsWithAtLeastOneAttendantWhoCheckedIn() {
  try {
    const { length } = await this.eventsDB('cd_events')
      .join('cd_applications', 'cd_events.dojo_id', 'cd_applications.dojo_id')
      .select('cd_applications.dojo_id')
      .whereRaw('cd_applications.attendance IS NOT NULL')
      .groupByRaw('cd_applications.dojo_id');
    if (this.output) {
      await append(
        this.filename,
        `\nCount of Dojos Using Events With at least an attendant who checked in${length}\n`,
      );
    }
    return length;
  } catch (error) {
    throw error;
  }
}
