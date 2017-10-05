import _ from 'lodash';
import { append } from '../util';
import userChampForVerifiedDojo from '../common/userChampForVerifiedDojo';

export default async function activeDojoChampions() {
  try {
    const { rows } = await this.usersClient.query(
      `SELECT id from sys_user WHERE init_user_type LIKE '%champion%' AND sys_user.when>= now() - interval '${this
        .interval} days' AND sys_user.when<= now();`,
    );
    const promises = [];
    rows.forEach((id) => {
      promises.push(_.bind(userChampForVerifiedDojo, this)(id));
    });
    const values = await Promise.all(promises);
    let usersInVerifiedDojos = 0;
    values.forEach((val) => {
      if (val === true) usersInVerifiedDojos += 1;
    });
    if (this.output) {
      await append(this.filename, `\nnew champions with registed dojos: ${usersInVerifiedDojos}\n`);
    }
    return usersInVerifiedDojos;
  } catch (err) {
    throw err;
  }
}
