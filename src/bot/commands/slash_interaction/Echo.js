const { SlashCommand } = require('../../classes');
const { Webhook, MessageEmbed } = require('discord.js');

module.exports = class extends SlashCommand {
  constructor(client) {
    super(client, {
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
      return await interaction.editReply(this.t('onlyOnServer', { locale }));

    const message = options.getString('message');

    const avatarURL = member?.displayAvatarURL({ dynamic: true }) || user.displayAvatarURL({ dynamic: true });

    const username = member?.displayName || user.username;

    if (!channel.permissionsFor(client.user.id).has(this.props.clientPermissions)) {
      const [, title, description] = message.match(this.textRegexp);

      const embeds = [new MessageEmbed().setColor(member.displayColor)
        .setAuthor({ name: username, iconURL: avatarURL })
        .setTitle(title || '')
        .setDescription(description || '')];

      return await interaction.reply({ embeds, ephemeral: true });
    }

    /** @type {Webhook} */
    const webhook = await channel.fetchWebhooks().then(w => w.find(v => v.name === client.user.id)) ||
      await channel.createWebhook(client.user.id);

    await webhook.send({ avatarURL, content: `${message}`, username });

    await interaction.reply({ content: ':heavy_check_mark:⠀', ephemeral: true });
  }
};