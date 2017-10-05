import _ from 'lodash';
import { append } from '../util';

export default async function verifiedDojoChamp() {
  try {
    const { rows } = await this.dojosClient.query(
      'SELECT user_id FROM cd_usersdojos JOIN public.cd_dojos on public.cd_usersdojos.dojo_id = public.cd_dojos.id where "owner"=1 and public.cd_dojos.verified=1 and public.cd_dojos.stage != 4 and public.cd_dojos.deleted = 0\'',
      [],
    );
    const champions = _.map(rows, 'user_id');
    const verifiedChampions = await this.usersDB
      .select('email')
      .from('sys_user')
      .whereIn('id', champions);
    let message = 'All verified dojos and champions in the World: \n';
    const champs = [];
    verifiedChampions.forEach((champ) => {
      message += `${champ},\n`;
      champs.push(champ);
    });
    if (this.output) await append(this.filename, message);
    return champs;
  } catch (err) {
    throw err;
  }
}
