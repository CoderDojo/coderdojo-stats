import { append } from '../util';

export default async function recentEvents() {
  try {
    const { length } = await this.eventsDB('cd_events')
      .select()
      .where('created_at', '>', this.monthAgo.format('YYYY-MM-DD HH:mm:ss'));
    if (this.output) {
      await append(
        this.filename,
        `\nTotal Count of Events since ${this.monthAgo.format('YYYY-MM-DD HH:mm')}: ${length}\n`,
      );
    }
    return length;
  } catch (error) {
    throw error;
  }
}
