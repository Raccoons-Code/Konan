const { SlashCommand } = require('../../classes');
const { Webhook, MessageEmbed } = require('discord.js');

module.exports = class extends SlashCommand {
  constructor(...args) {
    super(...args, {
      clientPermissions: ['MANAGE_WEBHOOKS'],
    });
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

    const avatarURL = member.displayAvatarURL() || user.displayAvatarURL();

    const username = member?.nickname || user.username;

    if (!channel.permissionsFor(client.user.id).has(this.props.clientPermissions)) {
      const [, title, description] = message.match(this.textRegexp);

      const embeds = [new MessageEmbed().setColor(member.displayColor)
        .setAuthor({ name: username, iconURL: avatarURL })
        .setTitle(title || '')
        .setDescription(description || '')];

      return interaction.reply({ embeds, ephemeral: true });
    }

    /** @type {Webhook} */
    const webhook = await channel.fetchWebhooks().then(w => w.find(v => v.name === client.user.id)) ||
      await channel.createWebhook(client.user.id);

    await webhook.send({ avatarURL, content: `${message}`, username });

    interaction.reply({ content: ':heavy_check_mark:⠀', ephemeral: true });
  }
};