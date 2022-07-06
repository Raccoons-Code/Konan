import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { env } from 'node:process';
import { SlashCommand } from '../../structures';

const { OWNER_ID } = env;

export default class Throw extends SlashCommand {
  constructor() {
    super({
      ownerOnly: true,
    });

    this.data = new SlashCommandBuilder().setName('throw')
      .setDescription('Throw new error (Restricted for bot\'owners).')
      .setNameLocalizations(this.getLocalizations('throwName'))
      .setDescriptionLocalizations(this.getLocalizations('throwDescription'))
      .addStringOption(option => option.setName('error')
        .setDescription('Error message.')
        .setNameLocalizations(this.getLocalizations('throwErrorName'))
        .setDescriptionLocalizations(this.getLocalizations('throwErrorDescription'))
        .setRequired(true));
  }

  async execute(interaction: ChatInputCommandInteraction) {
    const { options, user } = interaction;

    if (!OWNER_ID?.split(',').includes(user.id)) return;

    const error = options.getString('error', true);

    throw Error(error);
  }
}