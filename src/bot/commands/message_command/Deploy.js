const { Command } = require('../../classes');
const Commands = require('../');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: 'deploy',
      description: 'Deploy commands (Restricted for bot\'owners).',
      args: {
        type: ['global', 'guild'],
        reset: ['true', undefined],
      },
    });
  }

  async execute(message = this.Message) {
    message.delete().catch(() => null);

    const { args, author, client, guild } = message;

    const owners = process.env.OWNER_ID?.split(',');
    const guilds = process.env.GUILD_ID?.split(',');

    if (!owners?.includes(author.id)) return;

    const locale = guild?.preferredLocale;

    const [type, reset] = args;

    if (!this.data.args.type.includes(type) || !this.data.args.reset.includes(reset))
      return this.msg_del_time_async(await message.reply(`${this.t('Expected arguments:', { locale })}\nType: ${this.data.args.type.join(', ')}\nReset: ${this.data.args.reset.join(' ')}`), 10);

    const data = [];
    const data_private = [];
    const commands = [];
    const { applicationCommands } = Commands;

    Object.values(applicationCommands).forEach(_commands => commands.push(_commands.toJSON()));

    commands.flat().forEach(command => {
      if (command.data.defaultPermission || typeof command.data.defaultPermission === 'undefined')
        return reset || data.push(command.data.toJSON());

      command.data.setDefaultPermission(true);

      const command_data = command.data.toJSON();

      data_private.push(command_data);
    });

    try {
      if (type === 'global')
        await client.application.commands.set(data);

      for (let i = 0; i < guilds?.length; i++) {
        const id = guilds[i];

        const _guild = client.guilds.resolve(id) ||
          client.guilds.cache.get(id) ||
          await client.guilds.fetch(id);

        if (!_guild) continue;

        if (type === 'global') {
          await _guild.commands.set(data_private);
          continue;
        }

        await _guild.commands.set([...data, ...data_private]);
      }

      this.msg_del_time_async(await message.reply(`${this.t('Successfully reloaded application (/) commands. Type:', { locale })} ${type}`).catch(() => null), 10);

      console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
      console.error(error);

      this.msg_del_time_async(await message.reply(`${this.t('Error trying to reload application commands (/). Type:', { locale })} ${type}`).catch(() => null), 10);
    }
  }
};