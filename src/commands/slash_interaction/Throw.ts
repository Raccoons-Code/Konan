import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { SlashCommand } from '../../structures';

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
    const { client, options, user } = interaction;

    const owners = await this.Util.getApplicationOwners.getOwnersId(client);

    if (!owners.includes(user.id)) return;

    const error = options.getString('error', true);

    throw Error(error);
  }
}