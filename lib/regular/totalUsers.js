import _ from 'lodash';
import { log, append } from '../util';

export default async function totalUsers() {
  const adults = [];
  const o13 = [];
  const u13 = [];
  try {
    const users = await this.usersDB('sys_user').select('init_user_type', 'id');
    users.forEach((user) => {
      if (_.includes(user.init_user_type, 'attendee-o13')) {
        o13.push(users.id);
      } else if (_.includes(user.init_user_type, 'attendee-u13')) {
        u13.push(user.id);
      } else {
        adults.push(user.id);
      }
    });
    const profiles = await this.usersDB('cd_profiles').select('user_id', 'gender');
    const o13male = o13.reduce(ninja => _.includes(profiles[_.findIndex(profiles, ninja)], 'Male'));
    const o13female = o13.reduce(ninja =>
      _.includes(profiles[_.findIndex(profiles, ninja)], 'Female'),
    );
    const o13undisclosed = o13.reduce(
      ninja =>
        !_.includes(profiles[_.findIndex(profiles, ninja)], 'Female') &&
        !_.includes(profiles[_.findIndex(profiles, ninja)], 'Male'),
    );
    const u13male = u13.reduce(ninja => _.includes(profiles[_.findIndex(profiles, ninja)], 'Male'));
    const u13female = u13.reduce(ninja =>
      _.includes(profiles[_.findIndex(profiles, ninja)], 'Female'),
    );
    const u13undisclosed = u13.reduce(
      ninja =>
        !_.includes(profiles[_.findIndex(profiles, ninja)], 'Female') &&
        !_.includes(profiles[_.findIndex(profiles, ninja)], 'Male'),
    );
    if (this.output) {
      await append(
        this.filename,
        `\nTotal users\nNinjas under 13 ${u13.length}\nMale ${u13male} female ${u13female} Undisclosed ${u13undisclosed}\nNinjas over 13 ${o13.length}\nMale ${o13male} female ${o13female} Undisclosed ${o13undisclosed}\nAdults ${adults.length}\n`,
      );
    }
    log('that other stupid long one is done, i blame the db');
    return {
      u13: { total: u13.length, male: u13male, female: u13female, undisclosed: u13undisclosed },
      o13: { total: o13.length, male: o13male, female: o13female, undisclosed: o13undisclosed },
      adults: { total: adults.length },
    };
  } catch (error) {
    throw error;
  }
}
