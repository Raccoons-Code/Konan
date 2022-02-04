const { SlashCommand } = require('../../classes');
const { env: { OWNER_ID } } = process;

module.exports = class extends SlashCommand {
  constructor(...args) {
    super(...args);
    this.data = this.setName('throw')
      .setDescription('Throw new error')
      .setDefaultPermission(false)
      .addStringOption(option => option.setName('error')
        .setDescription('Error message')
        .setRequired(true));
  }

  async execute(interaction = this.CommandInteraction) {
    const { options, user } = interaction;

    if (!OWNER_ID?.split(',').includes(user.id)) return;

    const error = options.getString('error');

    this.client.sendError({ name: 'Command', message: this.data.name, stack: error }).then(() =>
      interaction.reply({ content: 'Successfully sended.', ephemeral: true })).catch(() =>
        interaction.reply({ content: 'Unable to send.', ephemeral: true }));
  }
};