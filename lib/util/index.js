import fs from 'fs-extra';
import moment from 'moment';

const date = moment();

export function sortByKey(array, key) {
  return array.sort((a, b) => {
    const x = a[key];
    const y = b[key];
    const xBigger = x > y ? 1 : 0;
    return x < y ? -1 : xBigger;
  });
}

export function log(string) {
  console.log(string); // eslint-disable-line no-console
  return Promise.resolve();
}

export const write = (filename, data) =>
  fs.outputFile(`stats/${date.format('YYYY-MM-DD')}/${filename}`, data).then(log(filename));

export const append = (filename, data) =>
  fs
    .ensureFile(`stats/${date.format('YYYY-MM-DD')}/${filename}`)
    .then(fs.appendFile(`stats/${date.format('YYYY-MM-DD')}/${filename}`, data))
    .then(log(data));

export default { sortByKey, log, write, append };
