const { SlashCommand } = require('../../classes');
const { Webhook, MessageEmbed } = require('discord.js');
const dynamic = true;

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
    const { client, channel, member, options, user } = interaction;

    const content = options.getString('message');

    const avatarURL = member?.displayAvatarURL({ dynamic }) || user.displayAvatarURL({ dynamic });

    const username = member?.displayName || user.username;

    if (!channel.permissionsFor?.(client.user.id).has(this.props.clientPermissions)) {
      const [, title, description] = content.match(this.regexp.embed);

      const embeds = [new MessageEmbed()
        .setColor(member?.displayColor || 'RANDOM')
        .setFooter({ text: username, iconURL: avatarURL })
        .setTimestamp(Date.now())
        .setTitle(title)
        .setDescription(description)];

      return await interaction.reply({ embeds });
    }

    /** @type {Webhook} */
    const webhook = await channel.fetchWebhooks().then(w => w.find(v => v.name === client.user.id)) ||
      await channel.createWebhook(client.user.id);

    await webhook.send({ avatarURL, content, username });

    await interaction.reply({ content: ':heavy_check_mark:⠀', ephemeral: true });
  }
};