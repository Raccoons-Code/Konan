const { SlashCommand } = require('../../classes');
const { MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu } = require('discord.js');
const { env: { DONATE_LINK, GUILD_INVITE } } = process;

module.exports = class extends SlashCommand {
  constructor(client) {
    super(client);
    this.data = this.setName('help')
      .setDescription('Replies with Help!')
      .addStringOption(option => option.setName('command')
        .setDescription('Select a command')
        .setAutocomplete(true));
  }

  async execute(interaction = this.CommandInteraction) {
    if (interaction.isAutocomplete())
      return this.executeAutocomplete(interaction);

    await interaction.deferReply({ ephemeral: true });

    const { client, guild, locale, options, user } = interaction;

    const commandName = options.getString('command')?.split(' |')[0].toLowerCase();

    if (commandName) return this.executeCommand(interaction, commandName);

    const avatarURL = guild?.me.displayAvatarURL({ dynamic: true }) ||
      client.user.displayAvatarURL({ dynamic: true });

    const embeds = [new MessageEmbed()
      .setColor('RANDOM')
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

    const components = [
      new MessageActionRow().setComponents(buttons),
      new MessageActionRow().setComponents(menus),
    ];

    await interaction.editReply({ components, embeds });
  }

  async executeCommand(interaction = this.CommandInteraction, commandName) {
    const { client, locale } = interaction;

    const { slash_interaction } = client.commands;

    const command = slash_interaction.get(commandName);

    if (!command)
      return await interaction.editReply(this.t('command404', { locale }));

    const embeds = [new MessageEmbed().setColor('RANDOM')
      .setTitle(`${command.data.name} - ${command.data.description}`)
      .setDescription(this.convertOptionsToString(command.data.options))];

    interaction.editReply({ embeds });
  }

  async executeAutocomplete(interaction = this.AutocompleteInteraction, res = []) {
    if (interaction.responded) return;

    const { client, options } = interaction;

    const commandName = options.getString('command');
    const regex = RegExp(commandName, 'i');

    const { slash_interaction } = client.commands;

    const filtered = slash_interaction.filter(c => c.defaultPermission !== false && (regex.test(c.name) || regex.test(c.description)));

    const slashcommands = filtered.toJSON();

    for (let i = 0; i < slashcommands.length; i++) {
      const command = slashcommands[i];

      res.push({
        name: `${this.t(command.data.name)} | ${command.data.description}`,
        value: command.data.name,
      });

      if (i === 24) break;
    }

    await interaction.respond(res);
  }

  /**
   * @param {Array<DataOptions|Options>} dataOptions
   * @param {string} [text='']
   * @param {string} [index='']
   */
  convertOptionsToString(dataOptions, text = '', index = '') {
    for (let i = 0; i < dataOptions.length; i++) {
      const { autocomplete, description, name, options, required } = dataOptions[i];

      text = `${text}${index} \`${name}\` - \`${description}\`${autocomplete ? ' | `Autocomplete`' : ''}${required ? ' | `Required`' : ''}\n`;

      if (options)
        text = this.convertOptionsToString(options, text, index + '- ');

      if (index === '' || options && index === '- ')
        text = `${text}\n`;
    }

    return text;
  }
};

/**
 * @typedef DataOptions
 * @property {string} name
 * @property {string} description
 * @property {DataOptions[]|Options[]} options
 */

/**
 * @typedef Options
 * @property {Array[]} choices
 * @property {boolean} autocomplete
 * @property {number} type
 * @property {string} name
 * @property {string} description
 * @property {boolean} required
 */