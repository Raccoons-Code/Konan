import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { Client, SlashCommand } from '../../structures';

const { env } = process;
const { OWNER_ID } = env;

export default class Throw extends SlashCommand {
  constructor(client: Client) {
    super(client);
    this.data = new SlashCommandBuilder().setName('throw')
      .setDescription('Throw new error (Restricted for bot\'owners).')
      .setDefaultPermission(false)
      .addStringOption(option => option.setName('error')
        .setDescription('Error message.')
        .setRequired(true));
  }

  async execute(interaction: CommandInteraction) {
    const { options, user } = interaction;

    if (!OWNER_ID?.split(',').includes(user.id)) return;

    const error = options.getString('error', true);

    throw Error(error);
  }
}