const { SlashCommand } = require('../../classes');
const { Constants } = require('discord.js');
const { ChannelTypes } = Constants;
const { GUILD_NEWS, GUILD_NEWS_THREAD, GUILD_PRIVATE_THREAD, GUILD_PUBLIC_THREAD, GUILD_STORE, GUILD_TEXT } = ChannelTypes;
const GuildTextChannelTypes = [GUILD_NEWS, GUILD_NEWS_THREAD, GUILD_PRIVATE_THREAD, GUILD_PUBLIC_THREAD, GUILD_STORE, GUILD_TEXT];

module.exports = class extends SlashCommand {
  constructor(...args) {
    super(...args, {
      clientPermissions: ['MANAGE_MESSAGES', 'READ_MESSAGE_HISTORY'],
      userPermissions: ['MANAGE_MESSAGES'],
    });
    this.data = this.setName('clear')
      .setDescription('Deletes up to 1000 channel messages at once.')
      .addNumberOption(option => option.setName('amount')
        .setDescription('Amount of messages.')
        .setMaxValue(1000)
        .setMinValue(1)
        .setRequired(true))
      .addChannelOption(option => option.setName('channel')
        .setDescription('Select a channel to clear.')
        .addChannelTypes(GuildTextChannelTypes));
  }

  async execute(interaction = this.CommandInteraction) {
    await interaction.deferReply({ ephemeral: true });

    const { client, locale, member, options } = interaction;

    if (!interaction.inGuild())
      return interaction.editReply({
        content: this.t('onlyOnServer', { locale }),
        ephemeral: true,
      });

    const channel = options.getChannel('channel') || interaction.channel;

    const userPermissions = channel.permissionsFor(member).missing(this.props.userPermissions);

    if (userPermissions.length)
      return interaction.editReply(this.t('missingUserChannelPermission',
        { locale, PERMISSIONS: userPermissions }));

    const clientPermissions = channel.permissionsFor(client.user.id).missing(this.props.clientPermissions);

    if (clientPermissions.length)
      return interaction.editReply(this.t('missingChannelPermission', { locale, PERMISSIONS: clientPermissions }));

    const limit = options.getNumber('amount');

    try {
      const size = await this.bulkDelete(channel, limit);

      interaction.editReply(this.t(size ? 'messageDeleted' : 'noDeletedMessages', { count: size, locale, size }));
    } catch {
      interaction.editReply(this.t('messageDeleteError', { locale }));
    }
  }

  async bulkDelete(channel = this.TextChannel, number = 0, count = 0) {
    if (number < 1) return count;

    const limit = number > 100 ? 100 : number;

    const { size } = await channel.bulkDelete(limit, true);

    size && await this.util.waitAsync(500);

    const go = size && (number - size);

    count = go ? await this.bulkDelete(channel, (number - size), (count + size)) : count + size;

    return count;
  }
};