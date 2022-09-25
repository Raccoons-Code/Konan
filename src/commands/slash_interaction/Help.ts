import { ActionRowBuilder, APIEmbedField, ApplicationCommandNonOptionsData, ApplicationCommandSubCommand, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder, RouteBases, SelectMenuBuilder } from 'discord.js';
import { env } from 'node:process';
import commandHandler from '../../commands';
import { SlashCommand } from '../../structures';

export default class Help extends SlashCommand {
  constructor() {
    super({
      category: 'General',
    });

    this.data.setName('help')
      .setDescription('Show the help message.');
  }

  build() {
    return this.data
      .setNameLocalizations(this.getLocalizations('helpName'))
      .setDescriptionLocalizations(this.getLocalizations('helpDescription'))
      .addStringOption(option => option.setName('command')
        .setDescription('The command to show the help message for.')
        .setNameLocalizations(this.getLocalizations('helpCommandName'))
        .setDescriptionLocalizations(this.getLocalizations('helpCommandDescription'))
        .setAutocomplete(true));
  }

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ ephemeral: true });

    const { client, guild, locale, options, user } = interaction;

    const commandName = options.getString('command')?.split(' |')[0].toLowerCase();

    if (commandName) return this.executeCommand(interaction, commandName);

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
        .setURL(`${env.DONATE_LINK}`));

    const menus = [
      new SelectMenuBuilder()
        .setCustomId(JSON.stringify({ c: this.data.name }))
        .setOptions([
          { label: '🏠 Home', value: 'home', default: true }, // :home:
          { label: '🗃️ Commands', value: 'commands' }, // :card_box:
          { label: `${['🌎', '🌏', '🌍'][this.Util.mathRandom(2, 0)]} Languages`, value: 'localization' },
        ]),
    ];

    const components = [
      new ActionRowBuilder<ButtonBuilder>().setComponents(buttons),
      new ActionRowBuilder<SelectMenuBuilder>().setComponents(menus),
    ];

    return interaction.editReply({ components, embeds });
  }

  async executeCommand(interaction: ChatInputCommandInteraction, commandName: string): Promise<any> {
    const { locale } = interaction;

    const { slash_interaction } = commandHandler.commands;

    const command = slash_interaction.get(commandName);

    if (!command)
      return interaction.editReply(this.t('command404', { locale }));

    const embeds = [
      new EmbedBuilder()
        .setColor('Random')
        .setTitle(`${command.data.description}`)
        .setDescription(`${command}`)
        .setFields(this.convertOptionsToFields(command, command.data.options)),
    ];

    return interaction.editReply({ embeds });
  }

  convertOptionsToFields(command: any, dataOptions: any[]) {
    const fields: APIEmbedField[] = [];

    for (let i = 0; i < dataOptions.length; i++) {
      const { description, name, options } = <ApplicationCommandSubCommand>dataOptions[i];

      fields.push({
        name: `${description}`,
        value: options ? this.convertOptionsToString(command, options, name) : `> \`${name}\``,
      });
    }

    return fields;
  }

  convertOptionsToString(command: any, dataOptions: any[], subgroup?: string, text = '', index = '') {
    if (!dataOptions?.length) return `${command.getCommandMention(subgroup)}`;

    for (let i = 0; i < dataOptions.length; i++) {
      const { required, type } = <ApplicationCommandNonOptionsData>dataOptions[i];
      const { autocomplete, /* description, */ name, options } = <ApplicationCommandSubCommand>dataOptions[i];

      text = [
        (index || options) ? text : command.getCommandMention(subgroup), '\n ',
        type ? `> \`${name}\`` : `${command.getCommandMention(subgroup || name, subgroup ? name : null)}`,
        /* ` - \`${description}\``, */
        autocomplete ? ' | `Autocomplete`' : '',
        required ? ' | `Required`' : '',
      ].join('').trim();

      if (options)
        text = this.convertOptionsToString(command, options, index ? '' : name, text, index + '- ');
    }

    return text;
  }
}