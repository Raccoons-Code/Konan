const { SlashCommand } = require('../../classes');
const { Webhook } = require('discord.js');

module.exports = class extends SlashCommand {
  constructor(...args) {
    super(...args);
    this.data = this.setName('echo')
      .setDescription('Replies with your message!')
      .addStringOption(option => option.setName('message')
        .setDescription('Message to echo back.')
        .setRequired(true));
  }

  async execute(interaction = this.CommandInteraction) {
    const { client, channel, locale, member, options, user } = interaction;

    if (!interaction.inGuild())
      return interaction.editReply(this.t('Error! This command can only be used on one server.', { locale }));

    const message = options.getString('message');

    const username = member?.nickname || user.username;

    const avatarURL = user.displayAvatarURL();

    /** @type {Webhook} */
    const webhook = await channel.fetchWebhooks().then(w => w.find(v => v.name === client.user.id)) ||
      await channel.createWebhook(client.user.id);

    await webhook.send({ avatarURL, content: `${message}`, username });

    interaction.reply({ content: '⠀', ephemeral: true });
  }
};