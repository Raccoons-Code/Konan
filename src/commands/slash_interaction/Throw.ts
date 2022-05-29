import { SlashCommandBuilder } from '@discordjs/builders';
import { Client, CommandInteraction } from 'discord.js';
import { SlashCommand } from '../../structures';

const { env } = process;
const { OWNER_ID } = env;

export default class Throw extends SlashCommand {
  constructor(client: Client) {
    super(client);
    this.data = new SlashCommandBuilder().setName('throw')
      .setDescription('Throw new error (Restricted for bot\'owners).')
      .setNameLocalizations(this.getLocalizations('throwName'))
      .setDescriptionLocalizations(this.getLocalizations('throwDescription'))
      .setDefaultPermission(false)
      .addStringOption(option => option.setName('error')
        .setDescription('Error message.')
        .setNameLocalizations(this.getLocalizations('throwErrorName'))
        .setDescriptionLocalizations(this.getLocalizations('throwErrorDescription'))
        .setRequired(true));
  }

  async execute(interaction: CommandInteraction) {
    const { options, user } = interaction;

    if (!OWNER_ID?.split(',').includes(user.id)) return;

    const error = options.getString('error', true);

    throw Error(error);
  }
}