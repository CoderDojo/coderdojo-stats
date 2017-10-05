import _ from 'lodash';
import moment from 'moment';
import regularsStats from '../lib/regular';
import { log, append } from '../lib/util';
import {
  interval,
  getStats,
  getChampions,
  getMentors,
  getParents,
  getO13s,
  getDojos,
  includeNonDojoMembers,
  countries,
  excludedCountries,
  stats,
  output,
  aws,
  help,
} from './cli';
import s3 from '../lib/util/s3';
import {
  getChampionsEmailWithNewsletter,
  getMentorsEmailWithNewsletter,
  getO13sEmailWithNewsletter,
  getParentsEmailWithNewsletter,
} from '../lib/newsletter';
import getDojoAndChampionEmails from '../lib/getDojoAndChampionEmails';

(async () => {
  if (!getStats && !getChampions && !getMentors && !getParents && !getO13s && !getDojos) {
    help();
    process.exit(1);
  }
  const date = moment();
  stats.monthAgo = moment().day(-interval);
  stats.filename = 'stats.txt';
  stats.interval = interval;
  stats.output = output;
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
      await _.bind(regularsStats, stats)();
      if (aws.keyId && aws.secretKey && output) await s3(aws.keyId, aws.secretKey);
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
