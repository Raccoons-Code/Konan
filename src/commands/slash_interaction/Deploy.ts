import { ChatInputCommandInteraction, Client, SlashCommandBuilder } from 'discord.js';
import { env } from 'node:process';
import Commands from '..';
import { SlashCommand } from '../../structures';

const { DISCORD_TEST_GUILD_ID, OWNER_ID } = env;

export default class Deploy extends SlashCommand {
  constructor(client: Client) {
    super(client, {
      ownerOnly: true,
    });

    this.data = new SlashCommandBuilder().setName('deploy')
      .setDescription('Deploy commands (Restricted for bot\'owners).')
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

    const guilds = DISCORD_TEST_GUILD_ID?.split(',') ?? [];
    const owners = OWNER_ID?.split(',');

    if (!owners?.includes(user.id)) return;

    await interaction.deferReply({ ephemeral: true });

    const type = options.getString('type');
    const reset = options.getBoolean('reset');

    const data: any[] = [];
    const dataPrivate: any[] = [];
    const commands: SlashCommand[] = [];
    const { applicationCommandTypes } = Commands;
    const applicationCommands = await Commands.loadCommands(applicationCommandTypes);

    Object.values(applicationCommands).forEach(_commands =>
      commands.push(...<SlashCommand[]>_commands.toJSON()));

    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];

      const command_data = command.data.toJSON();

      if (command.props?.ownerOnly) {
        dataPrivate.push(command_data);

        continue;
      }

      reset ?? data.push(command_data);
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

          const guildCommandsData = guildCommands.filter(guild_command =>
            !dataPrivate.some(command => command.name === guild_command.name))
            .toJSON().reduce((acc, command) => acc.concat({
              defaultMemberPermissions: command.defaultMemberPermissions,
              description: command.description,
              descriptionLocalizations: command.descriptionLocalizations,
              descriptionLocalized: command.descriptionLocalized,
              dmPermission: command.dmPermission,
              name: command.name,
              nameLocalizations: command.nameLocalizations,
              nameLocalized: command.nameLocalized,
              options: command.options,
              permissions: command.permissions,
              type: command.type,
            }), <any[]>[]);

          guildCommandsData.push(...dataPrivate);

          await guild.commands.set(guildCommandsData);

          continue;
        }

        await guild.commands.set([...data, ...dataPrivate]);
      }

      console.log('Successfully reloaded application (/) commands.');

      return interaction.editReply(`${this.t(['reloadedAppCommands', 'type'], { locale })} ${type}`);
    } catch (error) {
      console.error(error);

      return interaction.editReply(`${this.t(['reloadAppCommandsError', 'type'], { locale })} ${type}`);
    }
  }
}