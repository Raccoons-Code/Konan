const { Command } = require('../../classes');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { env: { DONATE_LINK, GUILD_INVITE } } = process;

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: 'help',
      aliases: ['h'],
      description: 'Help!',
    });
  }

  async execute(message = this.Message) {
    const { author: user, client, guild } = message;

    const locale = guild?.preferredLocale;

    const embeds = [new MessageEmbed().setColor('RANDOM')
      .setTitle(this.t('Konan\'s support', { locale }))
      .setThumbnail(guild?.me.displayAvatarURL() || client.user.displayAvatarURL())
      .setDescription(this.t('help text', { locale, user }))];

    const buttons = [new MessageButton().setStyle('LINK')
      .setLabel(this.t('Invite Link', { locale }))
      .setURL(client.invite)];

    if (GUILD_INVITE)
      buttons.push(new MessageButton().setStyle('LINK')
        .setLabel(this.t('Server for support', { locale }))
        .setURL(`${client.options.http.invite}/${GUILD_INVITE}`));

    if (DONATE_LINK)
      buttons.push(new MessageButton().setStyle('LINK')
        .setLabel(this.t('donate', { locale, capitalize: true }))
        .setURL(`${DONATE_LINK}`));

    const components = [new MessageActionRow().setComponents(buttons)];

    this.timeout_erase(await message.reply({ components, embeds }), 60);
  }
};