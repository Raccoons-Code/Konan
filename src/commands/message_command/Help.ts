import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Message, RouteBases, SelectMenuBuilder } from 'discord.js';
import { env } from 'node:process';
import { Command } from '../../structures';

export default class Help extends Command {
  constructor() {
    super({
      name: 'help',
      description: 'Help!',
    });
  }

  async execute(message: Message) {
    const { author: user, client, guild } = message;

    const locale = guild?.preferredLocale;

    const me = guild?.members.me ?? client.user;

    const avatarURL = me?.displayAvatarURL() || null;

    const embeds = [
      new EmbedBuilder()
        .setColor('Random')
        .setDescription(this.t('helpText', { locale, user }))
        .setThumbnail(avatarURL)
        .setTitle(this.t('konanSupport', { locale })),
    ];

    const buttons = [
      new ButtonBuilder()
        .setEmoji('📮') // :postbox:
        .setLabel(this.t('inviteLink', { locale }))
        .setStyle(ButtonStyle.Link)
        .setURL(client.invite),
    ];

    if (env.GUILD_INVITE)
      buttons.push(new ButtonBuilder()
        .setEmoji('🪤') // :mouse_trap:
        .setLabel(this.t('supportServer', { locale }))
        .setStyle(ButtonStyle.Link)
        .setURL(`${RouteBases.invite}/${env.GUILD_INVITE}`));

    if (env.DONATE_LINK)
      buttons.push(new ButtonBuilder()
        .setEmoji('💸') // :money_with_wings:
        .setLabel(this.t('donate', { locale }))
        .setStyle(ButtonStyle.Link)
        .setURL(`${env.DONATE_LINK}`));

    const menus = [
      new SelectMenuBuilder()
        .setCustomId(JSON.stringify({ c: this.data.name }))
        .setOptions([
          { label: '🏠 Home', value: 'home', default: true }, // :home:
          { label: '🗃️ Commands', value: 'commands' }, // :card_box:
        /* { label: `${['🌎', '🌏', '🌍'][this.Util.mathRandom(2, 0)]} Languages`, value: 'localization' }, */
        ]),
    ];

    const components = [
      new ActionRowBuilder<ButtonBuilder>().setComponents(buttons),
      new ActionRowBuilder<SelectMenuBuilder>().setComponents(menus),
    ];

    return message.reply({ components, embeds });
  }
}