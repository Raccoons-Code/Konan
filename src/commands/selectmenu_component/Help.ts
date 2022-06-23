import { Client, EmbedFieldData, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, SelectMenuInteraction } from 'discord.js';
import { env } from 'node:process';
import { SelectMenuComponentInteraction, SlashCommand } from '../../structures';
import Util from '../../util';

const { DONATE_LINK, GUILD_INVITE } = env;
/* const resetProps = { attachments: [], components: [], content: null, embeds: [], files: [] }; */

export default class Help extends SelectMenuComponentInteraction {
  [k: string]: any;
  limit = Util.Constants.helpPageLimit;

  constructor(client: Client) {
    super(client, {
      name: 'help',
      description: 'Help menu',
    });
  }

  async execute(interaction: SelectMenuInteraction<'cached'>) {
    const { customId, values } = interaction;

    const { sc } = JSON.parse(customId);

    this[sc || values[0]]?.(interaction);
  }

  async home(interaction: SelectMenuInteraction<'cached'>) {
    const { client, guild, locale, user } = interaction;

    const avatarURL = <string>guild?.me?.displayAvatarURL({ dynamic: true }) ??
      client.user?.displayAvatarURL({ dynamic: true });

    const embeds = [
      new MessageEmbed()
        .setColor('RANDOM')
        .setDescription([
          this.t('helpText', { locale, user }),
          '',
          '[Terms of Service & Privacy](https://github.com/Raccoons-Code/Konan/wiki/Terms-of-Service-&-Privacy)',
        ].join('\n'))
        .setThumbnail(avatarURL)
        .setTitle(this.t('konanSupport', { locale })),
    ];

    const buttons = [
      new MessageButton()
        .setEmoji('📮') // :postbox:
        .setLabel(this.t('inviteLink', { locale }))
        .setStyle('LINK')
        .setURL(client.invite),
    ];

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

    return interaction.update({ components, embeds });
  }

  async commands(interaction: SelectMenuInteraction) {
    const { client, locale, message } = interaction;

    const { slash_interaction } = client.commands;

    const slashCommands = slash_interaction.filter((c: SlashCommand) => !c.props?.ownerOnly).toJSON();

    const embeds = [
      new MessageEmbed()
        .setColor('RANDOM')
        .setFields(this.convertCommandsToEmbedFields(slashCommands))
        .setFooter({ text: `Total: ${slashCommands.length}` })
        .setTitle(this.t('konanSupport', { locale })),
    ];

    message.components = [
      new MessageActionRow().setComponents([this.setSelectCategory('general')]),
      new MessageActionRow().setComponents([this.setSelectMenu(1)]),
    ];

    if (slashCommands.length > this.limit)
      message.components.unshift(new MessageActionRow()
        .setComponents(this.setPageButtons({
          category: 'general',
          page: 0,
          total: Math.floor(slashCommands.length / this.limit),
        })));

    return interaction.update({ components: message.components, embeds });
  }

  async localization(interaction: SelectMenuInteraction<'cached'>) {
    const { locale } = interaction;

    const embeds = [
      new MessageEmbed()
        .setColor('RANDOM')
        .setImage('https://badges.awesome-crowdin.com/translation-15144556-499220.png')
        .setTitle(this.t('konanSupport', { locale })),
    ];

    const menus = [this.setSelectMenu(2)];

    const components = [new MessageActionRow().setComponents(menus)];

    return interaction.update({ components, embeds });
  }

  async setCommandCategory(interaction: SelectMenuInteraction<'cached'>) {
    const { client, locale, message, values } = interaction;

    const commands = client.commandsByCategory[values[0]] || client.commands.slash_interaction;

    const slashCommands = commands.filter((c: any) => c.data.defaultPermission !== false).toJSON();

    const embeds = [
      new MessageEmbed()
        .setColor('RANDOM')
        .setFields(this.convertCommandsToEmbedFields(slashCommands))
        .setFooter({ text: `Total: ${slashCommands.length}` })
        .setTitle(this.t('konanSupport', { locale })),
    ];

    message.components = [
      new MessageActionRow().setComponents(this.setSelectCategory(values[0])),
      new MessageActionRow().setComponents(this.setSelectMenu(1)),
    ];

    if (slashCommands.length > this.limit)
      message.components.unshift(new MessageActionRow()
        .setComponents(this.setPageButtons({
          category: values[0],
          page: 0,
          total: Math.floor(slashCommands.length / this.limit),
        })));

    return interaction.update({ components: message.components, embeds });
  }

  setPageButtons({ category, page, total }: { category: string, page: number, total: number }) {
    return [
      new MessageButton()
        .setCustomId(JSON.stringify({ c: this.data.name, cbc: category, sc: 'commands', p: page - 1 }))
        .setDisabled(page < 1)
        .setLabel('Back')
        .setStyle('SECONDARY'),
      new MessageButton()
        .setCustomId(JSON.stringify({ c: '' }))
        .setDisabled(true)
        .setStyle('SECONDARY')
        .setLabel(`${page + 1}/${total + 1}`),
      new MessageButton()
        .setCustomId(JSON.stringify({ c: this.data.name, cbc: category, sc: 'commands', p: page + 1 }))
        .setDisabled(page >= total)
        .setLabel('Next')
        .setStyle('SECONDARY'),
    ];
  }

  convertCommandsToEmbedFields(
    commands: SlashCommand[],
    page = 0,
    fields: EmbedFieldData[] = [],
  ): EmbedFieldData[] {
    for (let i = (page * this.limit); i < commands.length; i++) {
      const { data } = commands[i];

      fields.push({
        name: `${data.name}`,
        value: `${data.description}`,
        inline: false,
      });

      if (fields.length === this.limit) break;
    }

    return fields;
  }

  /** @deprecated */
  convertCommandsToString(commands: SlashCommand[], text = '') {
    for (let i = 0; i < commands.length; i++) {
      const { data } = commands[i];

      text = `${text}/${data.name} - ${data.description}\n`;
    }

    return text;
  }

  setSelectMenu(i = 0) {
    // const earth = ['🌍', '🌎', '🌏'][this.Util.mathRandom(2, 0)]; :earth_africa: :earth_americas: :earth_asia:

    return new MessageSelectMenu()
      .setCustomId(JSON.stringify({ c: this.data.name }))
      .setOptions([
        { label: '🏠 Home', value: 'home', default: i === 0 }, // :home:
        { label: '🗃️ Commands', value: 'commands', default: i === 1 }, // :card_box:
        /* { label: `${earth} Languages`, value: 'localization', default: i === 2 }, */
      ]);
  }

  setSelectCategory(i: string | number = 0) {
    return new MessageSelectMenu()
      .setCustomId(JSON.stringify({ c: this.data.name, sc: 'setCommandCategory', i }))
      .setOptions([
        { label: '📝 General', value: 'general', default: i === 'general' }, // :pencil2:
        { label: '🤣 Fun', value: 'Fun', default: i === 'Fun' }, // :rofl:
        { label: '🎮 Games', value: 'Game', default: i === 'Game' }, // :video_game:
        { label: '🛡️ Moderation', value: 'Moderation', default: i === 'Moderation' }, // :shield:
        { label: '🧰 Utility', value: 'Utility', default: i === 'Utility' }, // :toolbox:
      ]);
  }
}