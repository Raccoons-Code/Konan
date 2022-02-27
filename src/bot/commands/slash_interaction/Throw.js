const { SlashCommand } = require('../../structures');
const { env: { OWNER_ID } } = process;

module.exports = class extends SlashCommand {
  constructor(client) {
    super(client);
    this.data = this.setName('throw')
      .setDescription('Throw new error (Restricted for bot\'owners).')
      .setDefaultPermission(false)
      .addStringOption(option => option.setName('error')
        .setDescription('Error message.')
        .setRequired(true));
  }

  async execute(interaction = this.CommandInteraction) {
    const { options, user } = interaction;

    if (!OWNER_ID?.split(',').includes(user.id)) return;

    const error = options.getString('error');

    throw Error(error);
  }
};