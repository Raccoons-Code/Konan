const { SlashCommand } = require('../../structures');
const { env } = process;
const { OWNER_ID } = env;

module.exports = class extends SlashCommand {
  constructor(client) {
    super(client);
    this.data = this.setName('respawn')
      .setDescription('Respawn application (Restricted for bot\'owners).')
      .setDefaultPermission(false);
  }

  async execute(interaction = this.CommandInteraction) {
    const { client, user } = interaction;

    const owners = OWNER_ID?.split(',');

    if (!owners?.includes(user.id)) return;

    await interaction.reply({ content: 'Respawned!', ephemeral: true });
    await client.shard.respawnAll();
  }
};