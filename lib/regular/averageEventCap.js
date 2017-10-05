/* eslint-disable camelcase */
import _ from 'lodash';
import { append, sortByKey } from '../util';

export default async function averageEventCap() {
  try {
    let rows = await this.eventsDB('cd_events')
      .join('cd_applications', 'cd_events.id', 'cd_applications.event_id')
      .select(
        'cd_applications.session_id',
        'cd_events.id',
        'cd_events.name',
        'cd_applications.attendance',
        'cd_events.dojo_id',
      )
      .where('created_at', '>', this.monthAgo.format('YYYY-MM-DD HH:mm:ss'));
    let prev;
    let res = [];
    rows = sortByKey(rows, 'session_id');
    rows.forEach(({ attendance, name, session_id, dojo_id, id }, i) => {
      if (_.isUndefined(prev) || session_id !== prev.session_id) {
        res.push({
          name,
          tickets: 1,
          checkin: _.isEmpty(attendance) ? 0 : 1,
          session_id,
          dojo_id,
          id,
        });
      } else if (_.isEmpty(attendance)) {
        res[res.length - 1].tickets += 1;
      } else {
        res[res.length - 1].tickets += 1;
        res[res.length - 1].checkin += 1;
      }
      prev = rows[i];
    });
    res = sortByKey(res, 'id');
    const events = [];
    rows = await this.eventsDB('cd_tickets').select('quantity', 'session_id');
    res.forEach(({ checkin, name, session_id, id, tickets }) => {
      if (id !== prev.id) {
        const j = _.findIndex(rows, ticket => session_id === ticket.session_id);
        if (!_.isUndefined(j)) {
          events.push({
            name,
            tickets,
            checkin,
            quantity: rows[j].quantity,
          });
        }
      } else {
        const j = _.findIndex(rows, ticket => session_id === ticket.session_id);
        if (!_.isUndefined(j)) {
          events[events.length - 1].tickets += tickets;
          events[events.length - 1].checkin += checkin;
          events[events.length - 1].quantity += rows[j].checkin;
        }
      }
    });
    if (this.output) {
      let output = '\nTickets Sold\n';
      events.forEach(({ name, tickets, checkin, quantity }) => {
        output += `${name} tickets Sold ${tickets} checkins ${checkin} tickets available ${quantity}\n`;
      });
      await append(this.filename, output);
    }
    return events;
  } catch (error) {
    throw error;
  }
}
