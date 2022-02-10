const { SlashCommand } = require('../../classes');
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const { env: { DONATE_LINK, GUILD_INVITE } } = process;

module.exports = class extends SlashCommand {
  constructor(...args) {
    super(...args);
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

    const commandName = options.getString('command');

    if (commandName) return this.executeCommand(interaction, commandName);

    const embeds = [new MessageEmbed().setColor('RANDOM')
      .setTitle(this.t('Konan\'s support', { locale }))
      .setThumbnail(guild?.me.displayAvatarURL() || client.user.displayAvatarURL())
      .setDescription(this.t('help text', { locale, user }))];

    const buttons = [new MessageButton().setStyle('LINK')
      .setLabel(this.t('Invite Link', { locale }))
      .setURL(client.invite)];

    if (GUILD_INVITE)
      buttons.push(new MessageButton().setStyle('LINK')
        .setLabel(this.t('Server for support', { locale }))
        .setURL(`${client.options.http.invite}/${GUILD_INVITE}`));

    if (DONATE_LINK)
      buttons.push(new MessageButton().setStyle('LINK')
        .setLabel(this.t('donate', { locale, capitalize: true }))
        .setURL(`${DONATE_LINK}`));

    const components = [new MessageActionRow().setComponents(buttons)];

    interaction.editReply({ components, embeds });
  }

  async executeCommand(interaction = this.CommandInteraction, commandName) {
    const { client } = interaction;

    const { slash_interaction } = client.commands;

    const command = slash_interaction.get(commandName);

    if (!command)
      return interaction.editReply('Error! command not found.');

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
        name: `${this.t(command.data.name, { capitalize: true })} | ${command.data.description}`,
        value: command.data.name,
      });

      if (i === 24) break;
    }

    interaction.respond(res);
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