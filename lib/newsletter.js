import _ from 'lodash';
import json2csv from 'json2csv';
import { log, write } from './util';

export async function getEveryNonChampionUsersEmailWithNewsletter() {
  try {
    const res = this.dojosDB
      .select('user_id')
      .from('cd_usersdojos')
      .whereRaw("array_to_string(user_types, ',') LIKE '%champion%'");
    const users = this.usersDB
      .select('email', 'name', 'init_user_type', 'mailing_list')
      .from('sys_user')
      .whereNotIn('id', _.map(res, 'user_id'))
      .andWhere('mailing_list', 1)
      .andWhereRaw("init_user_type::text NOT LIKE '%attendee%'");
    if (this.output) {
      const csv = json2csv({ data: users });
      await write('usersNewsletter.csv', csv);
    }
    return users;
  } catch (err) {
    throw err;
  }
}

export function getChampionsEmailWithNewsletter(countryCodes, exCountries, includeNonDojoMembers) {
  countryCodes.forEach(async countryCode => {
    _.bind(
      await getUserEmailWithNewsletter('champion', countryCode, exCountries, includeNonDojoMembers),
      this,
    );
  });
  return Promise.resolve();
}

export function getMentorsEmailWithNewsletter(countryCodes, exCountries, includeNonDojoMembers) {
  countryCodes.forEach(async countryCode => {
    _.bind(
      await getUserEmailWithNewsletter('mentor', countryCode, exCountries, includeNonDojoMembers),
      this,
    );
  });
  return Promise.resolve();
}

export function getParentsEmailWithNewsletter(countryCodes, exCountries, includeNonDojoMembers) {
  countryCodes.forEach(async countryCode => {
    _.bind(
      await getUserEmailWithNewsletter(
        'parent-guardian',
        countryCode,
        exCountries,
        includeNonDojoMembers,
      ),
      this,
    );
  });
  return Promise.resolve();
}

export function getO13sEmailWithNewsletter(countryCodes, exCountries, includeNonDojoMembers) {
  countryCodes.forEach(async countryCode => {
    _.bind(
      await getUserEmailWithNewsletter('o13', countryCode, exCountries, includeNonDojoMembers),
      this,
    );
  });
  return Promise.resolve();
}

async function getUserEmailWithNewsletter(
  userType,
  countryCode,
  excludedCountries,
  includeNonDojoMembers,
) {
  try {
    let query = `SELECT user_id FROM cd_usersdojos ud INNER JOIN cd_dojos d ON ud.dojo_id = d.id  WHERE ( array_to_string(user_types, ',') LIKE '%${userType}%' )`;
    if (countryCode) {
      query += ` AND alpha2 = '${countryCode}'`; // God this is ugly
    } else if (excludedCountries) {
      excludedCountries.forEach(excludedCountry => {
        query += ` AND alpha2 != '${excludedCountry}'`;
      });
    }
    const { rows } = await this.dojosClient.query(query, []);
    if (rows.length > 0) {
      const champions = _.map(rows, 'user_id');
      let championsProfiles = await this.usersDB
        .select('sys_user.email', 'sys_user.name', 'sys_user.mailing_list', 'cd_profiles.alpha2')
        .from('sys_user')
        .join('cd_profiles', 'sys_user.id', '=', 'cd_profiles.user_id')
        .whereIn('sys_user.id', champions)
        .andWhere('sys_user.mailing_list', 1);
      if (includeNonDojoMembers) {
        const nonDojoMemberChampionsProfiles = await this.usersDB
          .select('sys_user.email', 'sys_user.name', 'sys_user.mailing_list', 'cd_profiles.alpha2')
          .from('sys_user')
          .join('cd_profiles', 'sys_user.id', '=', 'cd_profiles.user_id')
          .where('sys_user.init_user_type', 'like', `%${userType}%`)
          .andWhere('sys_user.mailing_list', 1)
          .andWhere('cd_profiles.alpha2', countryCode);
        championsProfiles = championsProfiles.concat(nonDojoMemberChampionsProfiles);
      }
      championsProfiles = _.uniqBy(championsProfiles, 'email');
      if (championsProfiles.length > 0) {
        if (this.output) {
          const csv = json2csv({ data: championsProfiles });
          const fileName = `${userType + (countryCode || '')}Newsletter${excludedCountries &&
          excludedCountries.length > 0
            ? `_excluding_${excludedCountries.join('_')}`
            : ''}.csv`;
          await write(fileName, csv);
        }
        return championsProfiles;
      }
      log(`No ${userType} signed up to mailing list in ${countryCode}`);
      return;
    }
    log(`No ${userType} in ${countryCode}`);
  } catch (err) {
    throw err;
  }
}
