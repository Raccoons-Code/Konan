import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { env } from 'node:process';
import { SlashCommand } from '../../structures';

const { OWNER_ID } = env;

export default class Respawn extends SlashCommand {
  constructor() {
    super({
      ownerOnly: true,
    });

    this.data = new SlashCommandBuilder().setName('respawn')
      .setDescription('Respawn application (Restricted for bot\'owners).')
      .setNameLocalizations(this.getLocalizations('respawnName'))
      .setDescriptionLocalizations(this.getLocalizations('respawnDescription'))
      .setDefaultMemberPermissions(null);
  }

  async execute(interaction: ChatInputCommandInteraction) {
    const { client, user } = interaction;

    const owners = OWNER_ID?.split(',');

    if (!owners?.includes(user.id)) return;

    await interaction.reply({ content: 'Respawned!', ephemeral: true });

    await client.shard?.respawnAll();
  }
}