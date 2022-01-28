const { Command } = require('../../classes');
const { Message } = require('discord.js');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: 'dbupdate',
      description: 'description',
      args: ['table', 'id', 'key', 'value', 'type'],
    });
  }

  /** @param {Message} message */
  async execute(message, { args, author } = message) {
    message.delete().catch(() => null);

    const owners = process.env.OWNER_ID?.split(',');

    if (!owners?.includes(author.id)) return;

    const [table, id, key, value, type] = args;

    const handled_value = this[type?.toLowerCase()]?.(value) || value;

    await this.prisma[table]?.update({ where: { id }, data: { [key]: handled_value } });

    console.log(await this.prisma.user.findFirst({ where: { id } }));
  }

  int(value) {
    return parseInt(value);
  }
};