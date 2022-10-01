import { ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js';
import { appOwners } from '../../client';
import { SlashCommand } from '../../structures';

export default class Respawn extends SlashCommand {
  constructor() {
    super({
      ownerOnly: true,
    });

    this.data.setName('respawn')
      .setDescription('Respawn application (Restricted for bot\'owners).');
  }

  build() {
    return this.data
      .setDMPermission(false)
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
      .setNameLocalizations(this.getLocalizations('respawnName'))
      .setDescriptionLocalizations(this.getLocalizations('respawnDescription'))
      .setDefaultMemberPermissions(null);
  }

  async execute(interaction: ChatInputCommandInteraction) {
    const { client, user } = interaction;

    if (!await appOwners.isOwner(user.id)) return;

    await interaction.reply({ content: 'Respawned!', ephemeral: true });

    await client.shard?.respawnAll();
  }
}