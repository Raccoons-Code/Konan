import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { Client, SlashCommand } from '../../structures';

const { env } = process;
const { OWNER_ID } = env;

export default class Respawn extends SlashCommand {
  constructor(client: Client) {
    super(client);

    this.data = new SlashCommandBuilder().setName('respawn')
      .setDescription('Respawn application (Restricted for bot\'owners).')
      .setDefaultPermission(false);
  }

  async execute(interaction: CommandInteraction) {
    const { client, user } = interaction;

    const owners = OWNER_ID?.split(',');

    if (!owners?.includes(user.id)) return;

    await interaction.reply({ content: 'Respawned!', ephemeral: true });

    await client.shard?.respawnAll();
  }
}