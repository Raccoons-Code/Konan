const { SelectMenuInteraction } = require('../../classes');
const { MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu } = require('discord.js');
const { env: { DONATE_LINK, GUILD_INVITE } } = process;
const resetProps = { attachments: [], components: [], content: null, embeds: [], files: [] };

module.exports = class extends SelectMenuInteraction {
  constructor(client) {
    super(client);
    this.data = {
      name: 'help',
      description: 'Help menu',
    };
  }

  async execute(interaction = this.SelectMenuInteraction) {
    const { values } = interaction;

    this[values[0]]?.(interaction);
  }

  async home(interaction = this.SelectMenuInteraction) {
    const { client, guild, locale, user } = interaction;

    const avatarURL = guild?.me.displayAvatarURL({ dynamic: true }) ||
      client.user.displayAvatarURL({ dynamic: true });

    const embeds = [new MessageEmbed().setColor('RANDOM')
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

    const components = [new MessageActionRow().setComponents(buttons),
    new MessageActionRow().setComponents(menus)];

    await interaction.update({ ...resetProps, components, embeds });
  }

  async localization(interaction = this.SelectMenuInteraction) {
    const { locale } = interaction;

    const embeds = [new MessageEmbed().setColor('RANDOM')
      .setImage('https://badges.awesome-crowdin.com/translation-15144556-499220.png')
      .setTitle(this.t('konanSupport', { locale }))];

    const earth = ['🌎', '🌏', '🌍'][this.util.mathRandom(2, 0)];

    const menus = [new MessageSelectMenu()
      .setCustomId(JSON.stringify({ c: this.data.name }))
      .setOptions([
        { label: '🏠 Home', value: 'home' },
        { label: `${earth} Languages`, value: 'localization', default: true },
      ])];

    const components = [new MessageActionRow().setComponents(menus)];

    await interaction.update({ ...resetProps, components, embeds });
  }
};