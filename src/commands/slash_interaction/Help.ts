import { ActionRowBuilder, ApplicationCommandNonOptionsData, ApplicationCommandSubCommand, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder, RouteBases, SelectMenuBuilder, SlashCommandBuilder } from 'discord.js';
import { env } from 'node:process';
import commandHandler from '../../commands';
import { SlashCommand } from '../../structures';

export default class Help extends SlashCommand {
  constructor() {
    super({
      category: 'General',
    });

    this.data = new SlashCommandBuilder().setName('help')
      .setDescription('Show the help message.')
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
        .setTitle(`${command.data.name} - ${command.data.description}`)
        .setDescription(this.convertOptionsToString(command.data.options)),
    ];

    return interaction.editReply({ embeds });
  }

  convertOptionsToString(dataOptions: any[], text = '', index = '') {
    for (let i = 0; i < dataOptions.length; i++) {
      const { required } = <ApplicationCommandNonOptionsData>dataOptions[i];
      const { autocomplete, description, name, options } = <ApplicationCommandSubCommand>dataOptions[i];

      text = [
        text, '\n ', index,
        `\`${name}\` - \`${description}\``,
        autocomplete ? ' | `Autocomplete`' : '',
        required ? ' | `Required`' : '',
      ].join('').trim();

      if (options)
        text = this.convertOptionsToString(options, text, index + '- ');

      if (index === '' || options && index === '- ')
        text = `${text}\n`;
    }

    return text;
  }
}