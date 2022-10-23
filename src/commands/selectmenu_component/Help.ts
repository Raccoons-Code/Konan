import { ActionRowBuilder, APIEmbedField, ButtonBuilder, ButtonStyle, codeBlock, EmbedBuilder, RouteBases, SelectMenuBuilder, SelectMenuInteraction } from 'discord.js';
import { env } from 'node:process';
import commandHandler from '..';
import { SelectMenuComponentInteraction, SlashCommand } from '../../structures';
import Translator from '../../translator';
import Util from '../../util';

/* const resetProps = { attachments: [], components: [], content: null, embeds: [], files: [] }; */

export default class Help extends SelectMenuComponentInteraction {
  [x: string]: any;
  limit = Util.Constants.helpPageLimit;

  constructor() {
    super({
      name: 'help',
      description: 'Help menu',
    });
  }

  async execute(interaction: SelectMenuInteraction<'cached'>) {
    const { customId, values } = interaction;

    const { sc } = JSON.parse(customId);

    return this[sc ?? values[0]]?.(interaction);
  }

  async home(interaction: SelectMenuInteraction<'cached'>) {
    const { client, guild, locale, user } = interaction;

    const me = guild?.members.me ?? client.user;

    const avatarURL = me?.displayAvatarURL() || null;

    const embeds = [
      new EmbedBuilder()
        .setColor('Random')
        .setDescription([
          this.t('helpText', { locale, user }),
          '',
          '[Terms of Service & Privacy](https://github.com/Raccoons-Code/Konan/wiki/Terms-of-Service-&-Privacy)',
        ].join('\n'))
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
        .setURL(env.DONATE_LINK));

    const menus = [this.setSelectMenu(0)];

    const components = [
      new ActionRowBuilder<ButtonBuilder>().addComponents(buttons),
      new ActionRowBuilder<SelectMenuBuilder>().addComponents(menus),
    ];

    return interaction.update({ components, embeds });
  }

  async commands(interaction: SelectMenuInteraction) {
    const { locale } = interaction;

    const { slash_interaction } = commandHandler.commands;

    const slashCommands = slash_interaction.filter((c: SlashCommand) => !c.props?.ownerOnly).toJSON();

    const embeds = [
      new EmbedBuilder()
        .setColor('Random')
        .setFields(this.convertCommandsToEmbedFields(slashCommands))
        .setFooter({ text: `Total: ${slashCommands.length}` })
        .setTitle(this.t('konanSupport', { locale })),
    ];

    const components: ActionRowBuilder<ButtonBuilder | SelectMenuBuilder>[] = [
      new ActionRowBuilder<SelectMenuBuilder>().addComponents([this.setSelectCategory('general')]),
      new ActionRowBuilder<SelectMenuBuilder>().addComponents([this.setSelectMenu(1)]),
    ];

    if (slashCommands.length > this.limit)
      components.unshift(new ActionRowBuilder<ButtonBuilder>()
        .addComponents(this.setPageButtons({
          category: 'general',
          page: 0,
          total: Math.floor(slashCommands.length / this.limit),
        })));

    return interaction.update({ components, embeds });
  }

  async localization(interaction: SelectMenuInteraction<'cached'>) {
    const { locale } = interaction;

    const description = Object.entries(Translator.options.stats!).reduce((acc, [key, value]) =>
      `${acc}\n${`${this.Util.formatLocale(key).padStart(15)} = ${value}%`.padEnd(15)}`, '');

    const embeds = [
      new EmbedBuilder()
        .setColor('Random')
        .setDescription(codeBlock('css', description))
        .setTitle(this.t('konanSupport', { locale })),
    ];

    const menus = [this.setSelectMenu(2)];

    const components = [new ActionRowBuilder<SelectMenuBuilder>().addComponents(menus)];

    return interaction.update({ components, embeds });
  }

  async setCommandCategory(interaction: SelectMenuInteraction<'cached'>) {
    const { locale, values } = interaction;

    const commands = commandHandler.commandsByCategory[values[0]] || commandHandler.commands.slash_interaction;

    const slashCommands = commands.filter((c: any) => !c.props?.ownerOnly).toJSON();

    const embeds = [
      new EmbedBuilder()
        .setColor('Random')
        .setFields(this.convertCommandsToEmbedFields(slashCommands))
        .setFooter({ text: `Total: ${slashCommands.length}` })
        .setTitle(this.t('konanSupport', { locale })),
    ];

    const components: ActionRowBuilder<ButtonBuilder | SelectMenuBuilder>[] = [
      new ActionRowBuilder<SelectMenuBuilder>().addComponents(this.setSelectCategory(values[0])),
      new ActionRowBuilder<SelectMenuBuilder>().addComponents(this.setSelectMenu(1)),
    ];

    if (slashCommands.length > this.limit)
      components.unshift(new ActionRowBuilder<ButtonBuilder>()
        .addComponents(this.setPageButtons({
          category: values[0],
          page: 0,
          total: Math.floor(slashCommands.length / this.limit),
        })));

    return interaction.update({ components, embeds });
  }

  setPageButtons({ category, page, total }: { category: string, page: number, total: number }) {
    return [
      new ButtonBuilder()
        .setCustomId(JSON.stringify({ c: 'help', cbc: category, sc: 'commands', p: page - 1 }))
        .setDisabled(page < 1)
        .setLabel('<')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('{}')
        .setDisabled(true)
        .setStyle(ButtonStyle.Secondary)
        .setLabel(`${page + 1}/${total + 1}`),
      new ButtonBuilder()
        .setCustomId(JSON.stringify({ c: 'help', cbc: category, sc: 'commands', p: page + 1 }))
        .setDisabled(page >= total)
        .setLabel('>')
        .setStyle(ButtonStyle.Secondary),
    ];
  }

  convertCommandsToEmbedFields(
    commands: SlashCommand[],
    page = 0,
    fields: APIEmbedField[] = [],
  ): APIEmbedField[] {
    for (let i = (page * this.limit); i < commands.length; i++) {
      const command = commands[i];

      fields.push({
        name: `${command.data.name}`,
        value: `${command} - ${command.data.description}`.slice(0, 1024),
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
    const earth = ['🌍', '🌎', '🌏'][this.Util.mathRandom(2, 0)]; // :earth_africa: :earth_americas: :earth_asia:

    return new SelectMenuBuilder()
      .setCustomId(JSON.stringify({ c: 'help' }))
      .setOptions([
        { label: '🏠 Home', value: 'home', default: i === 0 }, // :home:
        { label: '🗃️ Commands', value: 'commands', default: i === 1 }, // :card_box:
        { label: `${earth} Languages`, value: 'localization', default: i === 2 },
      ]);
  }

  setSelectCategory(i: string | number = 0) {
    return new SelectMenuBuilder()
      .setCustomId(JSON.stringify({ c: 'help', sc: 'setCommandCategory', i }))
      .setOptions([
        { label: '📝 General', value: 'general', default: i === 'general' }, // :pencil2:
        { label: '🤣 Fun', value: 'Fun', default: i === 'Fun' }, // :rofl:
        { label: '🎮 Games', value: 'Game', default: i === 'Game' }, // :video_game:
        { label: '🛡️ Moderation', value: 'Moderation', default: i === 'Moderation' }, // :shield:
        { label: '🧰 Utility', value: 'Utility', default: i === 'Utility' }, // :toolbox:
      ]);
  }
}