import { codeBlock } from '@discordjs/builders';
import { MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, SelectMenuInteraction } from 'discord.js';
import { Client, SelectMenuComponentInteraction, SlashCommand } from '../../structures';

const { env } = process;
const { DONATE_LINK, GUILD_INVITE } = env;
const resetProps = { attachments: [], components: [], content: null, embeds: [], files: [] };

export default class Help extends SelectMenuComponentInteraction {
  constructor(client: Client) {
    super(client, {
      name: 'help',
      description: 'Help menu',
    });
  }

  async execute(interaction: SelectMenuInteraction) {
    const { values } = interaction;

    this[<'home'>values[0]]?.(interaction);
  }

  async home(interaction: SelectMenuInteraction) {
    const { client, guild, locale, user } = <SelectMenuInteraction<'cached'>>interaction;

    const avatarURL = <string>guild?.me?.displayAvatarURL({ dynamic: true }) ??
      client.user?.displayAvatarURL({ dynamic: true });

    const embeds = [new MessageEmbed()
      .setColor('RANDOM')
      .setDescription(this.t('helpText', { locale, user }))
      .setThumbnail(avatarURL)
      .setTitle(this.t('konanSupport', { locale }))];

    const buttons = [new MessageButton()
      .setEmoji('📮') // :postbox:
      .setLabel(this.t('inviteLink', { locale }))
      .setStyle('LINK')
      .setURL(this.client.invite)];

    if (GUILD_INVITE)
      buttons.push(new MessageButton()
        .setEmoji('🪤') // :mouse_trap:
        .setLabel(this.t('supportServer', { locale }))
        .setStyle('LINK')
        .setURL(`${client.options.http?.invite}/${GUILD_INVITE}`));

    if (DONATE_LINK)
      buttons.push(new MessageButton()
        .setEmoji('💸') // :money_with_wings:
        .setLabel(this.t('donate', { locale }))
        .setStyle('LINK')
        .setURL(`${DONATE_LINK}`));

    const menus = [this.setSelectMenu(0)];

    const components = [
      new MessageActionRow().setComponents(buttons),
      new MessageActionRow().setComponents(menus),
    ];

    await interaction.update({ components, embeds });
  }

  async commands(interaction: SelectMenuInteraction) {
    const { locale } = interaction;

    const { slash_interaction } = this.client.commands;

    const slashcommands = slash_interaction.filter((c: any) => c.data.defaultPermission !== false).toJSON();

    const embeds = [new MessageEmbed()
      .setColor('RANDOM')
      .setDescription(`${this.convertCommandsToString(slashcommands).match(this.pattern.content)?.[1]}`)
      .setFooter({ text: `Total: ${slashcommands.length}` })
      .setTitle(this.t('konanSupport', { locale }))];

    const menus = [this.setSelectMenu(1)];

    const components = [new MessageActionRow().setComponents(menus)];

    await interaction.update({ components, embeds });
  }

  async localization(interaction: SelectMenuInteraction) {
    const { locale } = interaction;

    const embeds = [new MessageEmbed()
      .setColor('RANDOM')
      .setImage('https://badges.awesome-crowdin.com/translation-15144556-499220.png')
      .setTitle(this.t('konanSupport', { locale }))];

    const menus = [this.setSelectMenu(2)];

    const components = [new MessageActionRow().setComponents(menus)];

    await interaction.update({ components, embeds });
  }

  convertCommandsToString(commands: SlashCommand[], text = '') {
    for (let i = 0; i < commands.length; i++) {
      const { data } = commands[i];

      text = `${text}/${data.name} - ${data.description}\n`;
    }

    return codeBlock('properties', text);
  }

  setSelectMenu(i = 0) {
    const earth = ['🌍', '🌎', '🌏'][this.util.mathRandom(2, 0)]; // :earth_africa: :earth_americas: :earth_asia:

    return new MessageSelectMenu()
      .setCustomId(JSON.stringify({ c: this.data.name }))
      .setOptions([
        { label: '🏠 Home', value: 'home', default: i === 0 }, // :home:
        { label: '🗃️ Commands', value: 'commands', default: i === 1 }, // :card_box:
        /* { label: `${earth} Languages`, value: 'localization', default: i === 2 }, */
      ]);
  }
}