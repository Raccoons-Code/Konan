const { SlashCommand } = require('../../classes');
const { env: { OWNER_ID } } = process;

module.exports = class extends SlashCommand {
  constructor(...args) {
    super(...args);
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