import _ from 'lodash';
import activeDojoChampionsOverLastMonths from './activeDojoChampionsOverLastMonths';
import { append } from '../util';

export async function PMBOPartlyFunctionalDojo() {
  try {
    let dojos = await _.bind(fullyActiveDojosByUser, this)();
    const dojosByEvents = await _.bind(activeDojosByRecentEvents, this)();
    dojos = _.uniq(_.map(dojos.concat(dojosByEvents), 'id'));
    if (this.output) await append('PMBOPartlyFunctionalDojo', dojos.length);
    return dojos;
  } catch (err) {
    throw err;
  }
}

export async function PMBOFullyFunctionalDojo() {
  try {
    let dojos = await _.bind(fullyActiveDojosByUser, this)();
    const dojosByEvents = await _.bind(activeDojosByRecentEvents, this)();
    dojos = _.intersection(_.map(dojos, 'id'), _.map(dojosByEvents, 'id'));
    if (this.output) await append('PMBOFullyFunctionalDojo', dojos.length);
    return dojos;
  } catch (err) {
    throw err;
  }
}

export async function fullyActiveDojosByUser() {
  try {
    const activeDojos = await _.bind(activeDojoChampionsOverLastMonths, this)();
    const userdojos = await this.dojosDB('cd_usersdojos')
      .select('user_id')
      .whereIn('dojo_id', activeDojos);
    const users = await this.usersDB('cd_profiles')
      .select('user_id', 'badges')
      .whereIn('user_id', _.map(userdojos, 'user_id'))
      .andWhereNot('badges', null);
    const badged = _.filter(users, ({ badges }) =>
      _.some(
        badges,
        ({ dateAccepted, slug }) =>
          new Date(dateAccepted) > new Date(2016, 1, 1) &&
          !_.includes(
            [
              'my-1st-dojo!',
              'europe-code-week-2016',
              'attend-5-dojo-sessions!',
              'attend-10-dojo-sessions!',
              'attend-25-dojo-sessions!',
              'mentor-badge',
            ],
            slug,
          ),
      ),
    );
    if (this.output) await append('badgedUsers', badged.length);
    const userDojosBadged = await this.dojosDB('cd_usersdojos')
      .select('dojo_id')
      .whereIn('user_id', _.map(badged, 'user_id'));
    const dojos = await this.dojosDB('cd_dojos')
      .select('id')
      .whereIn('id', _.map(userDojosBadged, 'dojo_id'));
    return dojos;
  } catch (err) {
    throw err;
  }
}

async function activeDojosByRecentEvents() {
  try {
    const events = this.eventsDB('cd_applications')
      .select('id', 'event_id', 'attendance')
      .whereRaw("ticket_type::text LIKE 'ninja' AND attendance IS NOT NULL");
    let validEvents = _.filter(events, ({ attendance }) => {
      // Seems like attendances are not ordered
      let latestDate = attendance[0];
      _.each(attendance, (attendanceDate) => {
        if (attendanceDate > latestDate) {
          latestDate = attendanceDate;
        }
      });
      return latestDate > new Date(2016, 1, 1);
    });
    validEvents = this.eventsDB('cd_applications')
      .select('event_id')
      .count('*')
      .whereIn('id', _.map(validEvents, 'id'))
      .groupByRaw('event_id')
      .havingRaw('count(*) > 1');
    let dojos = this.eventsDB('cd_events')
      .select('dojo_id')
      .count('*')
      .whereIn('id', _.map(validEvents, 'event_id'))
      .groupByRaw('dojo_id')
      .havingRaw('count(*) > 2');
    dojos = await this.dojosDB('cd_dojos').select('id').whereIn('id', _.map(dojos, 'dojo_id'));
    return dojos;
  } catch (err) {
    throw err;
  }
}
