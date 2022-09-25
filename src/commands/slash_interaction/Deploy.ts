import { ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js';
import { env } from 'node:process';
import commandHandler from '..';
import { SlashCommand } from '../../structures';

const { applicationCommandTypes } = commandHandler;

export default class Deploy extends SlashCommand {
  constructor() {
    super({
      ownerOnly: true,
    });

    this.data.setName('deploy')
      .setDescription('Deploy commands (Restricted for bot\'owners).');
  }

  build() {
    return this.data
      .setDMPermission(false)
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
      .setNameLocalizations(this.getLocalizations('deployName'))
      .setDescriptionLocalizations(this.getLocalizations('deployDescription'))
      .addStringOption(option => option.setName('type')
        .setDescription('The type of deploy.')
        .setNameLocalizations(this.getLocalizations('deployTypeOptionName'))
        .setDescriptionLocalizations(this.getLocalizations('deployTypeOptionDescription'))
        .setChoices({
          name: 'Global',
          value: 'global',
          name_localizations: this.getLocalizations('Global'),
        }, {
          name: 'Guild',
          value: 'guild',
          name_localizations: this.getLocalizations('Guild'),
        })
        .setRequired(true))
      .addBooleanOption(option => option.setName('reset')
        .setDescription('Whether to reset the commands.')
        .setNameLocalizations(this.getLocalizations('deployResetOptionName'))
        .setDescriptionLocalizations(this.getLocalizations('deployResetOptionDescription')));
  }

  async execute(interaction: ChatInputCommandInteraction): Promise<any> {
    const { client, locale, options, user } = interaction;

    const guilds = env.DISCORD_TEST_GUILD_ID?.split(',') ?? [];

    if (!await client.owners.isOwner(user.id)) return;

    await interaction.deferReply({ ephemeral: true });

    const type = options.getString('type');
    const reset = options.getBoolean('reset');

    const data: any[] = [];
    const dataPrivate: any[] = [];

    const applicationCommands = await commandHandler.loadCommands(applicationCommandTypes, true);

    const commands = Object.values(applicationCommands).reduce((acc, _commands) =>
      acc.concat(_commands.toJSON()), <SlashCommand[]>[]).flat();

    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];

      const commandData = command.data.toJSON();

      if (command.props?.ownerOnly) {
        dataPrivate.push(commandData);

        continue;
      }

      reset ?? data.push(commandData);
    }

    try {
      if (type === 'global')
        await client.application?.commands.set(data);

      for (let i = 0; i < guilds.length; i++) {
        const id = guilds[i];

        const guild = await client.guilds.fetch(id);

        if (!guild) continue;

        if (type === 'global') {
          const guildCommands = await guild.commands.fetch();

          const guildCommandsData = guildCommands.toJSON().filter(guildCommand =>
            !dataPrivate.some(command => command.name === guildCommand.name))
            .reduce((acc, command) => acc.concat({ ...command }), <any[]>[]);

          guildCommandsData.push(...dataPrivate);

          await guild.commands.set(guildCommandsData);

          continue;
        }

        await guild.commands.set([...data, ...dataPrivate]);
      }

      client.application?.commands.fetch();

      console.log('Successfully reloaded application (/) commands.');

      return interaction.editReply(`${this.t(['reloadedAppCommands', 'type'], { locale })} ${type}`);
    } catch (error) {
      console.error(error);

      return interaction.editReply(`${this.t(['reloadAppCommandsError', 'type'], { locale })} ${type}`);
    }
  }
}