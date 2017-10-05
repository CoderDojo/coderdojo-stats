import _ from 'lodash';
import { append } from '../util';

export default async function activeDojoChampionsOverLastMonths() {
  try {
    let champions = await this.dojosDB('cd_usersdojos')
      .select('user_id')
      .distinct('dojo_id')
      .whereRaw("user_types::text LIKE '%champion%' OR user_permissions::text LIKE '%dojo-admin%'");
    champions = await this.usersDB('sys_user')
      .select('id')
      .whereRaw(
        "sys_user.last_login>=  now() - interval '12 months' AND sys_user.when > '2016-01-01'",
      )
      .whereIn('id', _.map(champions, 'user_id'));
    let relations = await this.dojosDB('cd_usersdojos')
      .select('user_id')
      .distinct('dojo_id')
      .whereRaw("user_types::text LIKE '%champion%'")
      .whereIn('user_id', _.map(champions, 'id'));

    const activeDojos = await this.dojosDB('cd_dojos')
      .select('id')
      .whereIn('id', _.map(relations, 'dojo_id'))
      .whereRaw('stage != 4 AND verified = 1 AND deleted = 0');
    relations = _.filter(relations, ({ dojo_id }) => _.map(activeDojos, 'id').includes(dojo_id));
    // We need to do it this way to ensure
    // that we check for every champion of every dojos when there is multi champs/dojo
    const dojos = _.uniq(_.map(relations, 'dojo_id'));
    champions = _.uniq(_.map(relations, 'user_id'));
    if (this.output) {
      await append(
        this.filename,
        `Active champions, ${dojos.length}, ${relations.length}, ${champions.length}`,
      );
    }
    return { champions, dojos };
  } catch (err) {
    throw err;
  }
}
