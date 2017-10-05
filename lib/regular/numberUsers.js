import { append } from '../util';

export default async function numberUsers() {
  try {
    const rows = await this.usersDB('sys_user').count('*');
    if (this.output) await append(this.filename, `\nCount of All Users: ${rows[0].count}\n`);
    return rows[0].count;
  } catch (error) {
    throw error;
  }
}
