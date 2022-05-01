import { SlashCommandBuilder } from '@discordjs/builders';
import { ApplicationCommandNonOptionsData, ApplicationCommandOptionChoice, ApplicationCommandSubCommand, AutocompleteInteraction, CommandInteraction, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu } from 'discord.js';
import { Client, SlashCommand } from '../../structures';

const { env } = process;
const { DONATE_LINK, GUILD_INVITE } = env;

export default class Help extends SlashCommand {
  constructor(client: Client) {
    super(client, {
      category: 'General',
    });

    this.data = new SlashCommandBuilder().setName('help')
      .setDescription('Replies with Help!')
      .addStringOption(option => option.setName('command')
        .setDescription('Select a command')
        .setAutocomplete(true));
  }

  async execute(interaction: CommandInteraction): Promise<any> {
    if (interaction.isAutocomplete())
      return await this.executeAutocomplete(interaction);

    await interaction.deferReply({ ephemeral: true });

    const { client, guild, locale, options, user } = <CommandInteraction<'cached'>>interaction;

    const commandName = options.getString('command')?.split(' |')[0].toLowerCase();

    if (commandName) return await this.executeCommand(interaction, commandName);

    const avatarURL = <string>guild?.me?.displayAvatarURL({ dynamic: true }) ??
      client.user?.displayAvatarURL({ dynamic: true });

    const embeds = [new MessageEmbed()
      .setColor('RANDOM')
      .setDescription([
        this.t('helpText', { locale, user }),
        '',
        '[Terms of Service & Privacy](https://github.com/Raccoons-Code/Konan/wiki/Terms-of-Service-&-Privacy)',
      ].join('\n'))
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
        .setURL(`${client.options.http?.invite}/${GUILD_INVITE}`));

    if (DONATE_LINK)
      buttons.push(new MessageButton()
        .setEmoji('💸') // :money_with_wings:
        .setLabel(this.t('donate', { locale }))
        .setStyle('LINK')
        .setURL(`${DONATE_LINK}`));

    const menus = [new MessageSelectMenu()
      .setCustomId(JSON.stringify({ c: this.data.name }))
      .setOptions([
        { label: '🏠 Home', value: 'home', default: true }, // :home:
        { label: '🗃️ Commands', value: 'commands' }, // :card_box:
        /* { label: `${['🌎', '🌏', '🌍'][this.Util.mathRandom(2, 0)]} Languages`, value: 'localization' }, */
      ])];

    const components = [
      new MessageActionRow().setComponents(buttons),
      new MessageActionRow().setComponents(menus),
    ];

    await interaction.editReply({ components, embeds });
  }

  async executeCommand(interaction: CommandInteraction, commandName: string): Promise<any> {
    const { client, locale } = interaction;

    const { slash_interaction } = client.commands;

    const command = slash_interaction.get(commandName);

    if (!command)
      return await interaction.editReply(this.t('command404', { locale }));

    const embeds = [new MessageEmbed()
      .setColor('RANDOM')
      .setTitle(`${command.data.name} - ${command.data.description}`)
      .setDescription(this.convertOptionsToString(command.data.options))];

    await interaction.editReply({ embeds });
  }

  async executeAutocomplete(interaction: AutocompleteInteraction, res: ApplicationCommandOptionChoice[] = []) {
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

        const nameProps = [
          this.t(command.data.name),
          ' | ',
          command.data.description,
        ];

        res.push({
          name: `${nameProps.join('').slice(0, 100)}`,
          value: `${command.data.name}`,
        });

        if (i === 24) break;
      }
    }

    await interaction.respond(res);
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