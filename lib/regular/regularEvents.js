import _ from 'lodash';
import moment from 'moment';
import { append } from '../util';

export default async function regularEvents() {
  try {
    const recent = moment().week(-6);
    const recentEvnt = [];
    const rows = await this.eventsDB('cd_events').select('dates', 'dojo_id');
    rows.forEach(({ dates, dojo_id }) => {
      dates.some(({ startTime }) => {
        if (startTime > recent.format()) recentEvnt.push(dojo_id);
        return startTime > recent.format();
      });
    });
    if (this.output) {
      await append(
        this.filename,
        `\nDojos Createing events recently (in the last 6 weeks): ${_.uniq(recentEvnt).length}\n`,
      );
    }
    return _.uniq(recentEvnt);
  } catch (error) {
    throw error;
  }
}
