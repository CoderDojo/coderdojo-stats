import _ from 'lodash';
import activeDojoChampionsOverLastMonths from './activeDojoChampionsOverLastMonths';
import { append, log } from '../util';

export default async function partiallyActiveDojos() {
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
      _.some(badges, ({ dateAccepted }) => new Date(dateAccepted) > new Date(2016, 1, 1)),
    );
    log('badgedUsers', badged.length);
    const dojos = await this.dojosDB('cd_usersdojos')
      .select('dojo_id')
      .whereIn('user_id', _.map(badged, 'user_id'));
    if (this.output) await append(this.filename, `Partially Active Dojos: ${_.uniq(dojos).length}`);
    return _.uniq(dojos);
  } catch (err) {
    throw err;
  }
}
