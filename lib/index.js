import _ from 'lodash';
import json2csv from 'json2csv';
import moment from 'moment';
import { log, write } from './util';
import connection from './util/connection';
import {
  getChampionsEmailWithNewsletter,
  getMentorsEmailWithNewsletter,
  getO13sEmailWithNewsletter,
  getParentsEmailWithNewsletter,
} from './newsletter';
import getDojoAndChampionEmails from './getDojoAndChampionEmails';
import eventsSince from './regular/common/nbEventsSince';
import dojosWithRegularEvents from './regular/common/dojosWithRegularEvents';
import dojosWithRegularEventsBookedType from '../common/dojosWithRegularEventsBookedType';
import dojosCreatingEventsAndBooked from './dojosCreatingEventsAndBooked';
import dojosCreatingEventsAndBookedAndCheckedIn from './dojosCreatingEventsAndBookedAndCheckedIn';
import nbUserTypeTicketsBooked from './nbUserTypeTicketsBooked';
import badgeUsage from './badgeUsage';
import nbUserTypeTicketsChecked from './nbUserTypeTicketsChecked';
import nbUsersByType from './nbUsersByType';
import nbO13Gender from './nbUsersByGender';
import verifiedDojoChamp from './verifiedDojoChamp';
import nbDojosWithAdminRecentlyLoggedIn from './nbDojosWithPermRecentlyLoggedIn';
import nbMentorByUserType from './nbUsersByUserAssociationWithLegacy';
import nbBadges from './nbBadges';
import nbUsersByTypeJoinedDojo from './nbUsersByTypeJoinedDojo';
import activeDojos from './activeDojos';
import activeCountries from './activeCountries';
import nbUsersByUserAssociation from './nbUsersByUserAssociation';
import nbUsersByTypeWithBadges from './nbUsersByTypeWithBadges';
import nbBadgesForUserType from './nbBadgesForUserType';
import nbDojoLeadInStep from './nbDojoLeadInStep';
import nbDojoActive from './nbDojoActive';
import nbTargetUsingBadges from './nbTargetUsingBadges';
import nbVerifiedDojosActivelyUsingTicketingSince from './nbVerifiedDojosActivelyUsingTicketingSince';
import nbBadgesForUserAssociation from './nbBadgesForUserAssociation';
import atLeastNEventsWithNBooking from './dojosCreatingEventsAndBookedWithAtLeastNthEventsWithNthBookedUsertype';
import lessThanNEventsWithNCheckin from './verifiedDojosCreatingEventsWithLessThanNEventsWithNCheckinUsertype';
import verifiedDojosSinceWithLessThanNEvents from './verifiedDojosSinceWithLessThanNEvents';
import dojosUsingEvents from './dojodUsingEvents';
import NumberOfDojosWithEventsWithAtLeastOneAttendant from './NumberOfDojosWithEventsWithAtLeastOneAttendant';
import NumberOfDojosWithEventsWithAtLeastOneAttendantWhoCheckedIn from './NumberOfDojosWithEventsWithAtLeastOneAttendantWhoCheckedIn';
import regularEvents from './regularEvents';
import recentEvents from './recentEvents';
import groupedDojosUsingEvents from './groupedDojosUsingEvents';
import activeDojoMentorsOverLastMonths from './activeDojoMentorsOverLastMonths';
import activeDojoChampions from './activeDojoChampions';
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
import activeDojosPerCountry from './activeDojosPerCountry';
import { PMBOPartlyFunctionalDojo, PMBOFullyFunctionalDojo } from './PMBO';

export default class {
  constructor(program) {
    this.output = program.output || false;
    const stats = connection({
      user      : program.user || 'platform',
      password  : program.password || 'QdYx3D5y',
      usersHost : program.usersHost || 'localhost',
      dojosHost : program.dojosHost || 'localhost',
      eventsHost: program.eventsHost || 'localhost',
      usersdb   : program.usersdb || 'cp-users-development',
      dojosdb   : program.dojosdb || 'cp-dojos-development',
      eventsdb  : program.eventsdb || 'cp-events-development',
    });
    this.usersDB = stats.usersDB;
    this.dojosDB = stats.dojosDB;
    this.eventsDB = stats.eventsDB;
    this.usersClient = stats.usersClient;
    this.dojosClient = stats.dojosClient;
    this.eventsClient = stats.eventsClient;
    this.interval = program.interval || '30';
    this.monthAgo = moment().day(-this.interval);
  }
  getO13EmailsPerCountry(...args) {
    return getO13EmailsPerCountry.apply(this, args);
  }
  getUsersEmailByOldUserType(...args) {
    return getUsersEmailByOldUserType.apply(this, args);
  }
  getDojosFrom(...args) {
    return getDojosFrom.apply(this, args);
  }
  getChampionsEmailFrom(...args) {
    return getChampionsEmailFrom.apply(this, args);
  }
  getChampionsEmailWithNewsletter(...args) {
    return getChampionsEmailWithNewsletter.apply(this, args);
  }
  getMentorsEmailWithNewsletter(...args) {
    return getMentorsEmailWithNewsletter.apply(this, args);
  }
  getO13sEmailWithNewsletter(...args) {
    return getO13sEmailWithNewsletter.apply(this, args);
  }
  getParentsEmailWithNewsletter(...args) {
    return getParentsEmailWithNewsletter.apply(this, args);
  }
  getDojoAndChampionEmails(...args) {
    return getDojoAndChampionEmails.apply(this, args);
  }
  PMBOFullyFunctionalDojo(...args) {
    return PMBOFullyFunctionalDojo.apply(this, args);
  }
  PMBOPartlyFunctionalDojo(...args) {
    return PMBOPartlyFunctionalDojo.apply(this, args);
  }
  numberUsers(...args) {
    return numberUsers.apply(this, args);
  }
  numberOfDojosWithEventsWithAtLeastOneAttendant(...args) {
    return NumberOfDojosWithEventsWithAtLeastOneAttendant.apply(this, args);
  }
  numberOfDojosWithEventsWithAtLeastOneAttendantWhoCheckedIn(...args) {
    return NumberOfDojosWithEventsWithAtLeastOneAttendantWhoCheckedIn.apply(this, args);
  }
  numberOfYouthBooked(...args) {
    return NumberOfYouthBooked.apply(this, args);
  }
  numberOfYouthBookedAndCheckedIn(...args) {
    return NumberOfYouthBookedAndCheckedIn.apply(this, args);
  }
  numberOfYouthBookedAndCheckedInAtLeastTwice(...args) {
    return NumberOfYouthBookedAndCheckedInAtLeastTwice.apply(this, args);
  }
  numberOfYouthBookedAtLeastTwice(...args) {
    return NumberOfYouthBookedAtLeastTwice.apply(this, args);
  }
  eventsSince(...args) {
    return eventsSince.apply(this, args);
  }
  dojosCreatingEventsAndBooked(...args) {
    return dojosCreatingEventsAndBooked.apply(this, args);
  }
  dojosCreatingEventsAndBookedAndCheckedIn(...args) {
    return dojosCreatingEventsAndBookedAndCheckedIn.apply(this, args);
  }
  dojosUsingEvents(...args) {
    return dojosUsingEvents.apply(this, args);
  }
  dojosWithRegularEvents(...args) {
    return dojosWithRegularEvents.apply(this, args);
  }
  dojosWithRegularEventsBookedType(...args) {
    return dojosWithRegularEventsBookedType.apply(this, args);
  }
  badgeUsage(...args) {
    return badgeUsage.apply(this, args);
  }
  nbBadges(...args) {
    return nbBadges.apply(this, args);
  }
  nbUsersByType(...args) {
    return nbUsersByType.apply(this, args);
  }
  nbUsersByTypeJoinedDojo(...args) {
    return nbUsersByTypeJoinedDojo.apply(this, args);
  }
}

// Functions for stats
async function getO13EmailsPerCountry(countryCode) {
  try {
    const o13Profiles = await this.usersDB
      .select('email', 'name')
      .from('cd_profiles')
      .whereRaw(`user_type::text LIKE '%o13%' AND email IS NOT NULL AND alpha2 ='${countryCode}'`);
    if (!(o13Profiles.length > 0)) return;
    if (this.output) {
      const csv = json2csv({ data: o13Profiles });
      await write(`o13From${countryCode}.csv`, csv);
    }
    return o13Profiles;
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
    if (this.output) {
      const csv = json2csv({ data: filteredUsers });
      await write(`legacy${userType}.csv`, csv);
    }
    return filteredUsers;
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
    if (this.output) {
      const csv = json2csv({ data: championsProfiles });
      await write(`championsFrom${countryCode}.csv`, csv);
    }
    return championsProfiles;
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
    if (this.output) {
      const csv = json2csv({ data: dojos });
      await write(`dojosFrom${countryCodes}.csv`, csv);
    }
    return dojos;
  } catch (err) {
    throw err;
  }
}
