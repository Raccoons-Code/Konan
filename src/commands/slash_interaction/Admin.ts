import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { SlashCommand } from '../../structures';

export default class Admin extends SlashCommand {
  [x: string]: any;

  constructor() {
    super({
      ownerOnly: true,
    });

    this.data = new SlashCommandBuilder().setName('admin')
      .setDescription('Admin commands (Restricted for bot\'owners).')
      .setDMPermission(false)
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
      .addSubcommandGroup(subcommandgroup => subcommandgroup.setName('guilds')
        .setDescription('Guild management commands.')
        .addSubcommand(subcommand => subcommand.setName('search')
          .setDescription('Search for a guild by their ID.')
          .addStringOption(option => option.setName('query')
            .setDescription('Search for a guild by their name.')
            .setAutocomplete(true)
            .setRequired(true))))
      .addSubcommandGroup(subcommandgroup => subcommandgroup.setName('users')
        .setDescription('User management commands.')
        .addSubcommand(subcommand => subcommand.setName('search')
          .setDescription('Search for a user by their ID.')
          .addStringOption(option => option.setName('query')
            .setDescription('Search for a user by their username.')
            .setAutocomplete(true)
            .setRequired(true))));
  }

  async execute(interaction: ChatInputCommandInteraction) {
    const { client, user } = interaction;

    if (!await this.Util.getAppOwners.isOwner(client, user.id)) return;
  }
}