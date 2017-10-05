import json2csv from 'json2csv';
import { log, write } from './util';

// Yup, it's a monstrosity, but it works! :D
export default async function getDojoAndChampionEmails(countryCode, address) {
  try {
    const csvRows = [];
    const dojo = this.dojosDB
      .select('id', 'email', 'name', 'alpha2')
      .from('cd_dojos')
      .where('verified', '=', 1)
      .andWhere('deleted', '=', 0)
      .andWhere('stage', '!=', 4);
    if (countryCode) {
      dojo.andWhere('alpha2', '=', countryCode);
    }
    if (address) {
      dojo.andWhereRaw(
        `(address1 ILIKE '%${address}%' OR place->>'toponymname' ILIKE '%${address}%' OR place->>'nameWithHierarchy' ILIKE '%${address}%')`,
      );
    }
    const dojos = await dojo;
    const dojosSelectChain = [];
    dojos.forEach(({ id }) => {
      dojosSelectChain.push(
        this.dojosDB
          .select('user_id', 'name', 'email', 'alpha2', 'user_types')
          .from('cd_usersdojos')
          .join('cd_dojos', 'cd_usersdojos.dojo_id', '=', 'cd_dojos.id')
          .where('dojo_id', '=', id),
      );
    });
    const dojoResults = await Promise.all(dojosSelectChain);
    const selectChain = [];
    dojoResults.forEach((usersDojos) => {
      usersDojos.forEach((usersDojo) => {
        selectChain.push(
          this.usersDB
            .select('name', 'email')
            .from('cd_profiles')
            .where('user_id', '=', usersDojo.user_id)
            .then((users) => {
              users.forEach((user) => {
                user.dojoName = usersDojo.name;
                user.dojoEmail = usersDojo.email;
                user.country = usersDojo.alpha2;
                user.address = usersDojo.address1;
                user.place = usersDojo.place;
                user.userTypes = usersDojo.user_types;
              });
              return users;
            }),
        );
      });
    });
    const results = await Promise.all(selectChain);
    results.forEach((users) => {
      if (users[0] && users[0].userTypes.includes('champion')) {
        csvRows.push({
          championName: users[0].name,
          championEmail: users[0].email,
          dojoName: users[0].dojoName,
          dojoEmail: users[0].dojoEmail,
          country: users[0].country,
          userTypes: JSON.stringify(users[0].userTypes),
        });
      }
    });
    if (this.output) {
      const csv = json2csv({ data: csvRows });
      await write(`${countryCode}_Dojos.csv`, csv);
      log(`${countryCode}_Dojos.csv saved`);
    }
    return csvRows;
  } catch (err) {
    throw err;
  }
}
