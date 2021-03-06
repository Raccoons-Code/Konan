import { SlashCommandBuilder } from '@discordjs/builders';
import { ApplicationCommandNonOptionsData, ApplicationCommandOptionChoiceData, ApplicationCommandSubCommand, AutocompleteInteraction, Client, CommandInteraction, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu } from 'discord.js';
import { env } from 'node:process';
import { SlashCommand } from '../../structures';

const { DONATE_LINK, GUILD_INVITE } = env;

export default class Help extends SlashCommand {
  constructor(client: Client) {
    super(client, {
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

  async execute(interaction: CommandInteraction | AutocompleteInteraction) {
    if (interaction.isAutocomplete())
      return this.executeAutocomplete(interaction);

    await interaction.deferReply({ ephemeral: true });

    const { client, guild, locale, options, user } = interaction;

    const commandName = options.getString('command')?.split(' |')[0].toLowerCase();

    if (commandName) return this.executeCommand(interaction, commandName);

    const clientUser = guild?.me ?? client.user;

    const avatarURL = <string>clientUser?.displayAvatarURL({ dynamic: true });

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
        .setEmoji('????') // :postbox:
        .setLabel(this.t('inviteLink', { locale }))
        .setStyle('LINK')
        .setURL(client.invite),
    ];

    if (GUILD_INVITE)
      buttons.push(new MessageButton()
        .setEmoji('????') // :mouse_trap:
        .setLabel(this.t('supportServer', { locale }))
        .setStyle('LINK')
        .setURL(`${client.options.http?.invite}/${GUILD_INVITE}`));

    if (DONATE_LINK)
      buttons.push(new MessageButton()
        .setEmoji('????') // :money_with_wings:
        .setLabel(this.t('donate', { locale }))
        .setStyle('LINK')
        .setURL(`${DONATE_LINK}`));

    const menus = [
      new MessageSelectMenu()
        .setCustomId(JSON.stringify({ c: this.data.name }))
        .setOptions([
          { label: '???? Home', value: 'home', default: true }, // :home:
          { label: '??????? Commands', value: 'commands' }, // :card_box:
        /* { label: `${['????', '????', '????'][this.Util.mathRandom(2, 0)]} Languages`, value: 'localization' }, */
        ]),
    ];

    const components = [
      new MessageActionRow().setComponents(buttons),
      new MessageActionRow().setComponents(menus),
    ];

    return interaction.editReply({ components, embeds });
  }

  async executeCommand(interaction: CommandInteraction, commandName: string): Promise<any> {
    const { client, locale } = interaction;

    const { slash_interaction } = client.commands;

    const command = slash_interaction.get(commandName);

    if (!command)
      return interaction.editReply(this.t('command404', { locale }));

    const embeds = [
      new MessageEmbed()
        .setColor('RANDOM')
        .setTitle(`${command.data.name} - ${command.data.description}`)
        .setDescription(this.convertOptionsToString(command.data.options)),
    ];

    return interaction.editReply({ embeds });
  }

  async executeAutocomplete(interaction: AutocompleteInteraction, res: ApplicationCommandOptionChoiceData[] = []) {
    if (interaction.responded) return;

    const { client, options } = interaction;

    const focused = options.getFocused(true);

    if (focused.name === 'command') {
      const commandName = options.getString('command', true);

      const pattern = RegExp(commandName, 'i');

      const { slash_interaction } = client.commands;

      const slashCommands = slash_interaction.filter((c: any) =>
        c.data.defaultPermission !== false && (
          pattern.test(c.data.name) ||
          pattern.test(c.data.description)
        )).toJSON();

      for (let i = 0; i < slashCommands.length; i++) {
        const command = slashCommands[i];

        const name = [
          this.t(command.data.name),
          ' | ',
          command.data.description,
        ].join('').slice(0, 100);

        res.push({
          name,
          value: `${command.data.name}`,
        });

        if (res.length === 25) break;
      }
    }

    return interaction.respond(res);
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