const { Command } = require('../../classes');
const { Message } = require('discord.js');
const Commands = require('../');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: 'deploy',
      description: 'deploy commands',
      args: {
        type: ['global', 'guild'],
        reset: ['true', undefined],
      },
    });
  }

  /** @param {Message} message */
  async execute(message) {
    const { args, author, client, guild } = message;

    const owners = process.env.OWNER_ID?.split(',');
    const guilds = process.env.GUILD_ID?.split(',');

    if (!owners.includes(author.id)) return;

    const locale = guild?.preferredLocale;

    const [type, reset] = args;

    if (!this.data.args.type.includes(type) || !this.data.args.reset.includes(reset))
      return message.reply(`${this.t('Expected arguments:', { locale })}\nType: ${this.data.args.type.join(' ')}\nReset: ${this.data.args.reset.join(' ')}`);

    const data = [];
    const commands = [];
    const { applicationCommands } = Commands;

    if (reset != 'true') {
      Object.values(applicationCommands).forEach(e => commands.push(e.toJSON()));

      commands.flat().forEach(e => data.push(e.data.toJSON()));
    }

    try {
      if (type === 'global') {
        await client.application.commands.set(data);
      } else {
        for (let i = 0; i < guilds.length; i++) {
          const id = guilds[i];

          const _guild = client.guilds.resolve(id) ||
            client.guilds.cache.get(id) ||
            await client.guilds.fetch(id);

          await _guild.commands.set(data);
        }
      }

      this.msg_del_time_async(await message.reply(`${this.t('Successfully reloaded application (/) commands. Type:', { locale })} ${type}`).catch(() => null));

      console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
      console.error(error);

      this.msg_del_time_async(await message.reply(`${this.t('Error trying to reload application commands (/). Type:', { locale })} ${type}`).catch(() => null));
    }
  }
};