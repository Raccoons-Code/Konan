import { Client, Message, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu } from 'discord.js';
import { Command } from '../../structures';

const { env } = process;
const { DONATE_LINK, GUILD_INVITE } = env;

export default class Help extends Command {
  constructor(client: Client) {
    super(client, {
      name: 'help',
      description: 'Help!',
    });
  }

  async execute(message: Message) {
    const { author: user, client, guild } = message;

    const locale = guild?.preferredLocale;

    const clientUser = guild?.me ?? client.user;

    const avatarURL = <string>clientUser?.displayAvatarURL({ dynamic: true });

    const embeds = [
      new MessageEmbed()
        .setColor('RANDOM')
        .setDescription(this.t('helpText', { locale, user }))
        .setThumbnail(avatarURL)
        .setTitle(this.t('konanSupport', { locale })),
    ];

    const buttons = [
      new MessageButton()
        .setEmoji('ðŪ') // :postbox:
        .setLabel(this.t('inviteLink', { locale }))
        .setStyle('LINK')
        .setURL(client.invite),
    ];

    if (GUILD_INVITE)
      buttons.push(new MessageButton()
        .setEmoji('ðŠĪ') // :mouse_trap:
        .setLabel(this.t('supportServer', { locale }))
        .setStyle('LINK')
        .setURL(`${client.options.http?.invite}/${GUILD_INVITE}`));

    if (DONATE_LINK)
      buttons.push(new MessageButton()
        .setEmoji('ðļ') // :money_with_wings:
        .setLabel(this.t('donate', { locale }))
        .setStyle('LINK')
        .setURL(`${DONATE_LINK}`));

    const menus = [
      new MessageSelectMenu()
        .setCustomId(JSON.stringify({ c: this.data.name }))
        .setOptions([
          { label: 'ð  Home', value: 'home', default: true }, // :home:
          { label: 'ðïļ Commands', value: 'commands' }, // :card_box:
        /* { label: `${['ð', 'ð', 'ð'][this.Util.mathRandom(2, 0)]} Languages`, value: 'localization' }, */
        ]),
    ];

    const components = [
      new MessageActionRow().setComponents(buttons),
      new MessageActionRow().setComponents(menus),
    ];

    return message.reply({ components, embeds });
  }
}