import _ from 'lodash';
import eventsSince from '../common/nbEventsSince';
import dojosWithRegularEvents from '../common/dojosWithRegularEvents';
import dojosWithRegularEventsBookedType from '../common/dojosWithRegularEventsBookedType';
import dojosCreatingEventsAndBooked from './dojosCreatingEventsAndBooked';
import dojosCreatingEventsAndBookedAndCheckedIn from './dojosCreatingEventsAndBookedAndCheckedIn';
import nbUserTypeTicketsBooked from './nbUserTypeTicketsBooked';
import badgeUsage from './badgeUsage';
import nbUserTypeTicketsChecked from './nbUserTypeTicketsChecked';
import nbUsersByType from './nbUsersByType';
import nbO13Gender from './nbUsersByGender';
import verifiedDojoChamp from './verifiedDojoChamp';
// import nbDojosWithAdminRecentlyLoggedIn from '../nbDojosWithPermRecentlyLoggedIn';
// import nbMentorByUserType from '../nbUsersByUserAssociationWithLegacy';
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

const autoBadges = [
  'my-1st-dojo!',
  'coolest-projects-2016',
  'mentor-badge',
  'champion-badge',
  'attend-25-dojo-sessions!',
  'europe-code-week-2016',
  'attend-10-dojo-sessions!',
  'dojocon-2016',
  'petes-test-badge',
  'attend-5-dojo-sessions!',
  'coderdojo-ethos:-implementation-and-practice',
  'inspiring-ninjas:-how-to-be-a-coderdojo-mentor',
];

export default function regularStats() {
  const monthAgo = this.monthAgo;
  return Promise.all([
    _.bind(numberUsers, this)(),
    _.bind(verifiedDojoChamp, this)(),
    _.bind(PMBOPartlyFunctionalDojo, this)(),
    _.bind(PMBOFullyFunctionalDojo, this)(),
    _.bind(activeDojoMentorsOverLastMonths, this)(),
    _.bind(activeDojoChampionsOverLastMonths, this)(),
    _.bind(activeDojos, this)(),
    _.bind(activeDojosPerCountry, this)(),
    _.bind(partiallyActiveDojos, this)(),
    _.bind(activeDojoChampions, this)(),
    _.bind(dojosUsingEvents, this)(),
    _.bind(groupedDojosUsingEvents, this)(),
    _.bind(recentEvents, this)(),
    _.bind(regularEvents, this)(),
    _.bind(newUsers, this)(monthAgo),
    _.bind(totalUsers, this)(),
    _.bind(averageEventCap, this)(),
    _.bind(NumberOfYouthBookedAndCheckedIn, this)(),
    _.bind(NumberOfYouthBooked, this)(),
    _.bind(NumberOfYouthBookedAtLeastTwice, this)(),
    _.bind(NumberOfYouthBookedAndCheckedInAtLeastTwice, this)(),
    _.bind(NumberOfDojosWithEventsWithAtLeastOneAttendant, this)(),
    _.bind(NumberOfDojosWithEventsWithAtLeastOneAttendantWhoCheckedIn, this)(),
    _.bind(eventsSince, this)(),
    _.bind(nbDojoActive, this)(monthAgo, true),
    _.bind(nbDojoActive, this)(monthAgo, true),
    _.bind(dojosWithRegularEvents, this)(monthAgo, 3),
    _.bind(dojosWithRegularEventsBookedType, this)(monthAgo, 3, 'ninja', 2),
    _.bind(activeDojos, this)(null, monthAgo),
    _.bind(dojosCreatingEventsAndBooked, this)(monthAgo),
    _.bind(dojosCreatingEventsAndBookedAndCheckedIn, this)(monthAgo),
    _.bind(badgeUsage, this)(monthAgo),
    _.bind(nbUserTypeTicketsChecked, this)(monthAgo, 'ninja'),
    _.bind(nbUserTypeTicketsChecked, this)(monthAgo, 'ninja', 0),
    _.bind(nbUserTypeTicketsChecked, this)(monthAgo, 'ninja', 1),
    _.bind(nbUserTypeTicketsBooked, this)(monthAgo, 'ninja'),
    _.bind(nbUserTypeTicketsBooked, this)(monthAgo, 'ninja', 0),
    _.bind(nbUserTypeTicketsBooked, this)(monthAgo, 'ninja', 1),
    _.bind(nbUsersByType, this)(monthAgo, 'attendee-u13'),
    _.bind(nbUsersByType, this)(monthAgo, 'attendee-o13'),
    _.bind(nbUsersByType, this)(monthAgo, ['attendee-u13', 'attendee-o13']),
    _.bind(nbO13Gender, this)(monthAgo, 'attendee-o13'),
    /*
    // NOTE: NOT USED, falsy as per login are stored upon creation, not activity.
    // Plus, potential multiple sessions (diff browsers/devices)
    _.bind(nbDojosWithAdminRecentlyLoggedIn, this)(monthAgo, ['dojo-admin']),
    _.bind(nbDojosWithAdminRecentlyLoggedIn, this)(
      monthAgo,
      ['dojo-admin'],
      true,
    ),
    // irrelevant, New role + old userType (even if old is not linked to a dojo)
    _.bind(nbMentorByUserType, this)('mentor'),
    */
    _.bind(nbUsersByTypeJoinedDojo, this)(monthAgo, 'attendee-u13'),
    _.bind(nbUsersByTypeJoinedDojo, this)(monthAgo, 'attendee-o13'),
    _.bind(nbUsersByTypeJoinedDojo, this)(monthAgo, ['attendee-u13', 'attendee-o13']),
    _.bind(nbBadges, this)(),
    _.bind(activeCountries, this)(),
    _.bind(nbUsersByTypeWithBadges, this)(monthAgo, ['attendee-u13', 'attendee-o13']),
    _.bind(nbBadgesForUserType, this)(monthAgo, ['attendee-u13', 'attendee-o13']),
    _.bind(nbBadgesForUserType, this)(monthAgo, ['champion', 'parent-guardian', 'mentor']),
    _.bind(activeDojos, this)(monthAgo),
    _.bind(nbUsersByUserAssociation, this)('champion'),
    _.bind(nbUsersByUserAssociation, this)('mentor'),
    _.bind(nbUsersByUserAssociation, this)('parent-guardian'),
    _.bind(nbUsersByType, this)(monthAgo, ['champion', 'parent-guardian', 'mentor']),
    _.bind(nbDojoLeadInStep, this)(2),
    _.bind(nbDojoLeadInStep, this)(3),
    _.bind(nbDojoLeadInStep, this)(4),
    _.bind(nbDojoLeadInStep, this)(5),
    _.bind(nbTargetUsingBadges, this)(
      monthAgo,
      1,
      ['attendee-o13', 'attendee-u13'],
      autoBadges,
      'dojos',
    ),
    _.bind(nbTargetUsingBadges, this)(monthAgo, 1, ['attendee-o13', 'attendee-u13'], null, 'dojos'),
    _.bind(nbTargetUsingBadges, this)(
      monthAgo,
      null,
      ['attendee-o13', 'attendee-u13'],
      null,
      'users',
    ),
    _.bind(nbTargetUsingBadges, this)(
      monthAgo,
      null,
      ['attendee-o13', 'attendee-u13'],
      null,
      'badges',
    ),
    _.bind(nbTargetUsingBadges, this)(
      monthAgo,
      null,
      ['attendee-o13', 'attendee-u13'],
      autoBadges,
      'users',
    ),
    _.bind(nbTargetUsingBadges, this)(
      monthAgo,
      null,
      ['attendee-o13', 'attendee-u13'],
      autoBadges,
      'badges',
    ),
    _.bind(nbVerifiedDojosActivelyUsingTicketingSince, this)(
      '2016-01-01',
      '2015-01-01',
      3,
      'ninja',
      2,
    ),
    _.bind(nbBadgesForUserAssociation, this)('2015-01-01', 'mentor'),
    _.bind(nbUsersByTypeJoinedDojo, this)('2015-01-01', ['champion', 'parent-guardian', 'mentor']),
    _.bind(atLeastNEventsWithNBooking, this)('2015-01-01', 3, 2, 'ninja', '2016-01-01'),
    _.bind(lessThanNEventsWithNCheckin, this)('2015-01-01', 3, 2, 'ninja', '2016-09-01'),
    _.bind(verifiedDojosSinceWithLessThanNEvents, this)('2015-01-01', 2, '2016-09-01'),
  ]);
}
