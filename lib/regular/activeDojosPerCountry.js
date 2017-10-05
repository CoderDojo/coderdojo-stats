import { append } from '../util';

/**
 * Active dojos in each country
 */
export default async function activeDojosPerCountry() {
  try {
    const rows = await this.dojosDB('cd_dojos')
      .where({
        verified: 1,
        deleted: 0,
      })
      .whereNot('stage', '4')
      .select('country_name');
    const a = [];
    let prev;
    const res = [];
    rows.forEach(({ country_name }) => {
      res.push(country_name);
    });
    res.sort();
    res.some((country) => {
      if (country !== prev) {
        a.push({
          country,
          dojos: 1,
        });
        prev = country;
        return country !== prev;
      }
      a[a.length - 1].dojos += 1;
      return country !== prev;
    });
    if (this.output) {
      let entry = '\nActive Dojos Broken Down by Country\n';
      a.forEach(({ country, dojos }) => {
        entry += `${country}: ${dojos}\n`;
      });
      await append(this.filename, entry);
    }
    return a;
  } catch (error) {
    throw error;
  }
}
