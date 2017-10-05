import _ from 'lodash';
import { append } from '../util';

export default async function activeDojoMentorsOverLastMonths() {
  try {
    let mentors = await this.dojosDB('cd_usersdojos')
      .select('user_id')
      .distinct('dojo_id')
      .whereRaw("user_types::text LIKE '%mentor%'");
    const activeMentors = await this.usersDB('sys_user')
      .select('id')
      .whereRaw(
        "sys_user.last_login>=  now() - interval '12 months' AND sys_user.when > '2016-01-01'",
      )
      .whereIn('id', _.map(mentors, 'user_id'));
    let relations = await this.dojosDB('cd_usersdojos')
      .select('user_id')
      .distinct('dojo_id')
      .whereRaw("user_types::text LIKE '%mentor%'")
      .whereIn('user_id', _.map(activeMentors, 'id'));
    const activeDojos = await this.dojosDB('cd_dojos')
      .select('id')
      .whereIn('id', _.map(relations, 'dojo_id'))
      .whereRaw('stage != 4 AND verified = 1 AND deleted = 0');
    relations = _.filter(relations, ({ dojo_id }) => _.map(activeDojos, 'id').includes(dojo_id));
    // We need to do it this way to ensure
    // that we check for every champion of every dojos when there is multi champs/dojo
    const dojos = _.uniq(_.map(relations, 'dojo_id'));
    mentors = _.uniq(_.map(relations, 'user_id'));
    if (this.output) {
      await append(
        this.filename,
        `Active mentors, ${dojos.length}, ${mentors.length}, ${relations.length}`,
      );
    }
    return { mentors, dojos };
  } catch (err) {
    throw err;
  }
}
