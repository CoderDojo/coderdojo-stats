import { append } from '../util';

export async function NumberOfYouthBooked() {
  try {
    const { length } = await this.eventsDB('cd_applications')
      .select()
      .where('ticket_type', 'ninja');
    if (this.output) await append(this.filename, `\nNumber of Youth booked${length}\n`);
    return length;
  } catch (error) {
    throw error;
  }
}

export async function NumberOfYouthBookedAtLeastTwice() {
  try {
    const { length } = await this.eventsDB('cd_applications')
      .count()
      .where('ticket_type', 'ninja')
      .groupByRaw('user_id')
      .havingRaw('count(*) > 1');
    if (this.output) {
      await append(this.filename, `\nNumber of Youth booked At least twice${length}\n`);
    }
    return length;
  } catch (error) {
    throw error;
  }
}

export async function NumberOfYouthBookedAndCheckedInAtLeastTwice() {
  try {
    const { length } = await this.eventsDB('cd_applications')
      .count()
      .where('ticket_type', 'ninja')
      .andWhereRaw(this.eventsDB.raw('attendance IS NOT NULL'))
      .groupByRaw('user_id')
      .havingRaw('count(*) > 1');
    if (this.output) {
      await append(
        this.filename,
        `\nNumber of Youth booked and checked in at least twice${length}\n`,
      );
    }
    return length;
  } catch (error) {
    throw error;
  }
}

export async function NumberOfYouthBookedAndCheckedIn() {
  try {
    const { length } = this.eventsDB('cd_applications')
      .select()
      .where('ticket_type', 'ninja')
      .andWhereRaw(this.eventsDB.raw('attendance IS NOT NULL'));
    if (this.output) {
      await append(this.filename, `\nNumber of Youth booked who checked in${length}\n`);
    }
    return length;
  } catch (error) {
    throw error;
  }
}
