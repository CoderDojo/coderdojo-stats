import _ from 'lodash';
import moment from 'moment';
import json2csv from 'json2csv';
import regularsStats from './regular';
import { log, write, append } from './util';
import {
  interval,
  getStats,
  getRegularStats,
  getChampions,
  getMentors,
  getParents,
  getO13s,
  getDojos,
  includeNonDojoMembers,
  countries,
  excludedCountries,
  stats,
  aws,
  help,
} from './util/cli';
import s3 from './util/s3';
import activeDojoMentorsOverLastMonths from './activeDojoMentorsOverLastMonths';
import activeDojos from './activeDojos';
import activeDojoChampions from './activeDojoChampions';
import {
  getChampionsEmailWithNewsletter,
  getMentorsEmailWithNewsletter,
  getO13sEmailWithNewsletter,
  getParentsEmailWithNewsletter,
} from './newsletter';
import getDojoAndChampionEmails from './getDojoAndChampionEmails';
import dojosUsingEvents from './dojodUsingEvents';
import NumberOfDojosWithEventsWithAtLeastOneAttendant from './NumberOfDojosWithEventsWithAtLeastOneAttendant';
import NumberOfDojosWithEventsWithAtLeastOneAttendantWhoCheckedIn from './NumberOfDojosWithEventsWithAtLeastOneAttendantWhoCheckedIn';
import regularEvents from './regularEvents';
import recentEvents from './recentEvents';
import groupedDojosUsingEvents from './groupedDojosUsingEvents';
import {
  NumberOfYouthBooked,
  NumberOfYouthBookedAndCheckedIn,
  NumberOfYouthBookedAtLeastTwice,
  NumberOfYouthBookedAndCheckedInAtLeastTwice,
} from './numberOfYouthBooked';
import totalUsers from './totalUsers';
import newUsers from './newUsers';
import averageEventCap from './averageEventCap';
import activeDojoChampionsOverLastMonths from './activeDojoChampionsOverLastMonths';
import partiallyActiveDojos from './partiallyActiveDojos';
import numberUsers from './numberUsers';
import { PMBOPartlyFunctionalDojo, PMBOFullyFunctionalDojo } from './PMBO';

(async () => {
  if (
    !getStats &&
    !getRegularStats &&
    !getChampions &&
    !getMentors &&
    !getParents &&
    !getO13s &&
    !getDojos
  ) {
    help();
    process.exit(1);
  }
  const date = moment();
  const monthAgo = moment().day(-interval);
  stats.monthAgo = monthAgo;
  stats.filename = 'stats.txt';
  stats.interval = interval;
  try {
    await stats.usersClient.connect();
    await stats.dojosClient.connect();
    await stats.eventsClient.connect();
    if (getChampions) {
      await _.bind(getChampionsEmailWithNewsletter, stats)(
        countries,
        excludedCountries,
        includeNonDojoMembers,
      );
    }
    if (getO13s) {
      await _.bind(getO13sEmailWithNewsletter, stats)(
        countries,
        excludedCountries,
        includeNonDojoMembers,
      );
    }
    if (getMentors) {
      await _.bind(getMentorsEmailWithNewsletter, stats)(
        countries,
        excludedCountries,
        includeNonDojoMembers,
      );
    }
    if (getParents) {
      await _.bind(getParentsEmailWithNewsletter, stats)(
        countries,
        excludedCountries,
        includeNonDojoMembers,
      );
    }
    if (getDojos) {
      await _.bind(getDojoAndChampionEmails, stats)(
        countries,
        excludedCountries,
        includeNonDojoMembers,
      );
    }
    if (getStats) {
      log(`Creating ${stats.filename}`);
      await append(stats.filename, `${date.format('YYYY-MM-DD')}\n`);
      await Promise.all([
        _.bind(numberUsers, stats)(),
        _.bind(PMBOPartlyFunctionalDojo, stats)(),
        _.bind(PMBOFullyFunctionalDojo, stats)(),
        _.bind(activeDojoMentorsOverLastMonths, stats)(),
        _.bind(activeDojoChampionsOverLastMonths, stats)(),
        _.bind(activeDojos, stats)(),
        _.bind(partiallyActiveDojos, stats)(),
        _.bind(activeDojoChampions, stats)(),
        _.bind(dojosUsingEvents, stats)(),
        _.bind(groupedDojosUsingEvents, stats)(),
        _.bind(recentEvents, stats)(),
        _.bind(regularEvents, stats)(),
        _.bind(newUsers, stats)(monthAgo),
        _.bind(totalUsers, stats)(),
        _.bind(averageEventCap, stats)(),
        _.bind(NumberOfYouthBookedAndCheckedIn, stats)(),
        _.bind(NumberOfYouthBooked, stats)(),
        _.bind(NumberOfYouthBookedAtLeastTwice, stats)(),
        _.bind(NumberOfYouthBookedAndCheckedInAtLeastTwice, stats)(),
        _.bind(NumberOfDojosWithEventsWithAtLeastOneAttendant, stats)(),
        _.bind(NumberOfDojosWithEventsWithAtLeastOneAttendantWhoCheckedIn, stats)(),
      ]);
    }
    if (getRegularStats) {
      log(`Creating ${stats.filename}`);
      const ctx = {
        // Config
        db: {
          usersDB: stats.usersDB,
          dojosDB: stats.dojosDB,
          eventsDB: stats.eventsDB,
        },
        monthAgo,
        filename: stats.filename,
        output: true, // write out to file, default false
      };
      await append(stats.filename, `${date.format('YYYY-MM-DD')}\n`);
      await _.bind(regularsStats, ctx)();
      await s3(aws.keyId, aws.secretKey);
    }
    await stats.usersClient.end();
    await stats.dojosClient.end();
    await stats.eventsClient.end();
    log('Stats finished');
    process.exit();
  } catch (err) {
    log(err);
    process.exit(1);
  }
})();

// Functions for stats
export async function getO13EmailsPerCountry(countryCode) {
  try {
    const o13Profiles = await this.usersDB
      .select('email', 'name')
      .from('cd_profiles')
      .whereRaw(`user_type::text LIKE '%o13%' AND email IS NOT NULL AND alpha2 ='${countryCode}'`);
    if (!(o13Profiles.length > 0)) return;
    const csv = json2csv({ data: o13Profiles });
    await write(`o13From${countryCode}.csv`, csv);
  } catch (err) {
    throw err;
  }
}

export async function getUsersEmailByOldUserType(userType) {
  try {
    const legacyUsers = await this.usersDB
      .select('user_id', 'email', 'name', 'user_type')
      .from('cd_profiles')
      .whereRaw(`user_type LIKE '%${userType}%'`);
    log('legacyUsers', legacyUsers.length);
    const users = await this.dojosClient.query(
      'SELECT user_id FROM cd_usersdojos ud INNER JOIN cd_dojos d ON ud.dojo_id = d.id ' +
        " WHERE ( array_to_string(user_types, ',') LIKE '%champion%' OR array_to_string(user_types, ',')  LIKE '%mentor%' )",
    );
    if (!users || !(users.rows.length > 0)) return;
    const filteredUsers = _.filter(legacyUsers, ({ user_id }) => !_.find(users.rows, { user_id }));
    if (!filteredUsers || !(filteredUsers.length > 0)) return;
    const csv = json2csv({ data: filteredUsers });
    await write(`legacy${userType}.csv`, csv);
  } catch (err) {
    throw err;
  }
}

export async function getChampionsEmailFrom(countryCode) {
  try {
    const { rows } = await this.dojosClient.query(
      "SELECT user_id FROM cd_usersdojos ud INNER JOIN cd_dojos d ON ud.dojo_id = d.id WHERE ( array_to_string(user_types, ',') LIKE '%champion%' OR array_to_string(user_types, ',')  LIKE '%mentor%' ) AND (d.alpha2='GB' OR d.alpha2='IE')",
      [],
    );
    const champions = _.map(rows, 'user_id');
    const championsProfiles = await this.usersDB
      .select('email', 'name')
      .from('cd_profiles')
      .whereIn('user_id', champions);
    const csv = json2csv({ data: championsProfiles });
    await write(`championsFrom${countryCode}.csv`, csv);
  } catch (err) {
    throw err;
  }
}

export async function getDojosFrom(countryCodes) {
  try {
    const dojos = await this.dojosDB
      .select('email', 'name')
      .from('cd_dojos')
      .whereIn('alpha2', countryCodes);
    const csv = json2csv({ data: dojos });
    await write(`dojosFrom${countryCodes}.csv`, csv);
  } catch (err) {
    throw err;
  }
}

export async function verifiedDojoChamp() {
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
    verifiedChampions.forEach((champ) => {
      message += `${champ},\n`;
    });
    await append(stats.filename, message);
  } catch (err) {
    throw err;
  }
}
