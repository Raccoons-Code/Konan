const { Command } = require('../../structures');
const Commands = require('../');

module.exports = class extends Command {
  constructor(client) {
    super(client, {
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
      return this.timeout_erase(await message.reply(`${this.t('expectedArguments', { locale })}\nType: ${this.data.args.type.join(', ')}\nReset: ${this.data.args.reset.join(' ')}`), 10);

    const data = [];
    const data_private = [];
    const commands = [];
    const { applicationCommands } = Commands;

    Object.values(applicationCommands).forEach(_commands => commands.push(..._commands.toJSON()));

    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];

      if (command.data.defaultPermission === false) {
        command.data.setDefaultPermission(true);

        const command_data = command.data.toJSON();

        data_private.push(command_data);

        continue;
      }

      reset || data.push(command.data.toJSON());
    }

    try {
      if (type === 'global')
        await client.application.commands.set(data);

      for (let i = 0; i < guilds?.length; i++) {
        const id = guilds[i];

        const _guild = await client.guilds.fetch(id);

        if (!_guild) continue;

        if (type === 'global') {
          await _guild.commands.set(data_private);
          continue;
        }

        await _guild.commands.set([...data, ...data_private]);
      }

      await this.timeout_erase(await message.reply(`${this.t(['reloadedAppCommands', 'type'], { locale })} ${type}`).catch(() => null), 10);

      console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
      console.error(error);

      await this.timeout_erase(await message.reply(`${this.t(['reloadAppCommandsError', 'type'], { locale })} ${type}`).catch(() => null), 10);
    }
  }
};