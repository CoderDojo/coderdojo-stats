import program from 'commander';
import connection from '../lib/util/connection';
import pkg from '../package.json';

program
  .version(pkg.version)
  .usage('[options]')
  .option('-s, --get-stats', 'Output regular stats to file and uplod to s3')
  .option('-i, --interval <days>', 'Amount of previous days to gather stats for', parseInt)
  .option('-o, --output', 'Write out to file')
  .option('--get-champions', 'Output champions emails signed up to mailing list to file')
  .option('--get-mentors', 'Output mentors emails signed up to mailing list to file')
  .option('--get-parents', 'Output parents emails signed up to mailing list to file')
  .option('--get-o13s', 'Output O13s emails signed up to mailing list to file')
  .option('--get-dojos', 'Output all dojo and champion emails to file')
  .option(
    '--include-non-dojo-members',
    'Include emails of those not a member of a dojo in email dump',
  )
  .option('--countries <items>', 'Comma separated list of country alpha2 codes', val =>
    val.split(','),
  )
  .option(
    '--excluded-countries <items>',
    'Comma separated list of country alpha2 codes to be excluded',
    val => val.split(','),
  )
  .option('--address <address>', 'A partial address to match across the address and city fields')
  .option('--usersdb <database>', 'Database name for users database')
  .option('--dojosdb <database>', 'Database name for dojos database')
  .option('--eventsdb <database>', 'Database name for events database')
  .option('--users-host <host>', 'Database address for users database')
  .option('--dojos-host <host>', 'Database address for dojos database')
  .option('--events-host <host>', 'Database address for events database')
  .option('--user <user>', 'Database user')
  .option('--password <password>', 'Database password')
  .option('--aws-key-id <id>', 'Access key for aws')
  .option('--aws-secret-key <secret>', 'Secret key for aws')
  .parse(process.argv);

export const interval = program.interval || '30';
export const getStats = program.getStats || false;
export const getChampions = program.getChampions || false;
export const getMentors = program.getMentors || false;
export const getParents = program.getParents || false;
export const getO13s = program.getO13s || false;
export const getDojos = program.getDojos || false;
export const includeNonDojoMembers = program.includeNonDojoMembers || false;
export const countries = program.countries || [];
export const excludedCountries = program.excludedCountries || [];
export const address = program.address || [];
export const stats = connection({
  user: program.user || 'platform',
  password: program.password || 'QdYx3D5y',
  usersHost: program.usersHost || 'localhost',
  dojosHost: program.dojosHost || 'localhost',
  eventsHost: program.eventsHost || 'localhost',
  usersdb: program.usersdb || 'cp-users-development',
  dojosdb: program.dojosdb || 'cp-dojos-development',
  eventsdb: program.eventsdb || 'cp-events-development',
});
export const output = program.output || false;
const outputHelp = program.outputHelp;
export const help = outputHelp.bind(program);
export const aws = {
  keyId: program.awsKeyId,
  secretKey: program.awsSecretKey,
};
