const { Command } = require('../../classes');
const { MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu } = require('discord.js');
const { env: { DONATE_LINK, GUILD_INVITE } } = process;

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: 'help',
      aliases: ['h'],
      description: 'Help!',
    });
  }

  async execute(message = this.Message) {
    const { author: user, client, guild } = message;

    const locale = guild?.preferredLocale;

    const avatarURL = guild?.me.displayAvatarURL({ dynamic: true }) ||
      client.user.displayAvatarURL({ dynamic: true });

    const embeds = [new MessageEmbed()
      .setColor('RANDOM')
      .setDescription(this.t('helpText', { locale, user }))
      .setThumbnail(avatarURL)
      .setTitle(this.t('konanSupport', { locale }))];

    const buttons = [new MessageButton()
      .setEmoji('📮') // :postbox:
      .setLabel(this.t('inviteLink', { locale }))
      .setStyle('LINK')
      .setURL(client.invite)];

    if (GUILD_INVITE)
      buttons.push(new MessageButton()
        .setEmoji('🪤') // :mouse_trap:
        .setLabel(this.t('supportServer', { locale }))
        .setStyle('LINK')
        .setURL(`${client.options.http.invite}/${GUILD_INVITE}`));

    if (DONATE_LINK)
      buttons.push(new MessageButton()
        .setEmoji('💸') // :money_with_wings:
        .setLabel(this.t('donate', { locale }))
        .setStyle('LINK')
        .setURL(`${DONATE_LINK}`));

    const menus = [new MessageSelectMenu()
      .setCustomId(JSON.stringify({ c: this.data.name }))
      .setOptions([
        { label: '🏠 Home', value: 'home', default: true },
        { label: `${['🌎', '🌏', '🌍'][this.util.mathRandom(2, 0)]} Languages`, value: 'localization' },
      ])];

    const components = [
      new MessageActionRow().setComponents(buttons),
      new MessageActionRow().setComponents(menus),
    ];

    await message.reply({ components, embeds });
  }
};