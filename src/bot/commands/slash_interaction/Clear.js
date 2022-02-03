const { SlashCommand } = require('../../classes');
const { Constants } = require('discord.js');
const { ChannelTypes } = Constants;
const { GUILD_NEWS, GUILD_NEWS_THREAD, GUILD_PRIVATE_THREAD, GUILD_PUBLIC_THREAD, GUILD_STORE, GUILD_TEXT } = ChannelTypes;
const GuildTextChannelTypes = [GUILD_NEWS, GUILD_NEWS_THREAD, GUILD_PRIVATE_THREAD, GUILD_PUBLIC_THREAD, GUILD_STORE, GUILD_TEXT];

module.exports = class extends SlashCommand {
  constructor(...args) {
    super(...args);
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

    const { locale, memberPermissions, options } = interaction;

    if (interaction.inGuild() && !memberPermissions.has('MANAGE_MESSAGES'))
      return interaction.editReply(this.t('You do not have permission to manage messages from the server.',
        { locale }));

    const channel = options.getChannel('channel') || interaction.channel;

    const limit = options.getNumber('amount');

    this.bulkDelete(channel, limit, true).then(size =>
      interaction.editReply(this.t(size ? '{{size}} message successfully deleted!' : 'No deleted messages!',
        { count: size, locale, size }))).catch(() =>
          interaction.editReply(this.t('Error! One or more messages could not be deleted.', { locale })));
  }

  async bulkDelete(channel = this.GuildChannel, number = 0, boolean = false, count = 0) {
    if (number < 1) return count;

    const limit = number > 100 ? 100 : number;

    const { size } = await channel.bulkDelete(limit, boolean).catch(() => null);

    size && await this.util.waitAsync(1000);

    count = size ? await this.bulkDelete(channel, (number - limit), boolean, (count + size)) : count;

    return count;
  }
};