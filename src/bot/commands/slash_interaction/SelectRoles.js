const { SlashCommand } = require('../../classes');
const { Constants, MessageSelectMenu, MessageActionRow, MessageEmbed, Message } = require('discord.js');
const { ChannelTypes } = Constants;
const { GUILD_NEWS, GUILD_NEWS_THREAD, GUILD_PRIVATE_THREAD, GUILD_PUBLIC_THREAD, GUILD_STORE, GUILD_TEXT } = ChannelTypes;
const GuildTextChannelTypes = [GUILD_NEWS, GUILD_NEWS_THREAD, GUILD_PRIVATE_THREAD, GUILD_PUBLIC_THREAD, GUILD_STORE, GUILD_TEXT];

module.exports = class extends SlashCommand {
  constructor(...args) {
    super(...args);
    this.data = this.setName('selectroles')
      .setDescription('Select menu roles')
      .setDefaultPermission(false)
      .addSubcommand(subcommand => subcommand.setName('setup')
        .setDescription('New select menu role')
        .addRoleOption(option => option.setName('role')
          .setDescription('Role')
          .setRequired(true))
        .addStringOption(option => option.setName('item_name')
          .setDescription('Item name'))
        .addStringOption(option => option.setName('item_description')
          .setDescription('Item description'))
        .addBooleanOption(option => option.setName('item_default')
          .setDescription('Set item default'))
        .addStringOption(option => option.setName('item_emoji')
          .setDescription('Item emoji'))
        .addBooleanOption(option => option.setName('menu_disabled')
          .setDescription('Set menu disabled'))
        .addStringOption(option => option.setName('text')
          .setDescription('Text: Title | Description'))
        .addChannelOption(option => option.setName('channel')
          .setDescription('Channel')
          .addChannelTypes(GuildTextChannelTypes)))
      .addSubcommandGroup(subcommandgroup => subcommandgroup.setName('edit')
        .setDescription('Edit select menu role')
        .addSubcommand(subcommand => subcommand.setName('message')
          .setDescription('Message')
          .addChannelOption(option => option.setName('channel')
            .setDescription('Channel')
            .setRequired(true)
            .addChannelTypes(GuildTextChannelTypes))
          .addStringOption(option => option.setName('id')
            .setDescription('Autocomplete | Message id | Message URL')
            .setAutocomplete(true)
            .setRequired(true))
          .addStringOption(option => option.setName('text')
            .setDescription('Text: Title | Description')
            .setRequired(true))));
  }

  async execute(interaction = this.CommandInteraction) {
    const { memberPermissions, options } = interaction;

    if (!memberPermissions.has('ADMINISTRATOR')) {
      if (interaction.isAutocomplete()) return interaction.respond([]);

      return interaction.reply({ content: 'You are not allowed to run this command.', ephemeral: true });
    }

    const command = options.getSubcommandGroup(false) || options.getSubcommand();

    if (interaction.isAutocomplete())
      return this[`${command}Autocomplete`]?.(interaction);

    await interaction.deferReply({ ephemeral: true });

    this[command]?.(interaction);
  }

  async setup(interaction = this.CommandInteraction) {
    const { client, guild, options } = interaction;

    const role = options.getRole('role');
    const label = options.getString('item_name');
    const description = options.getString('item_description');
    const _default = options.getString('item_default');
    const item_emoji = options.getString('item_emoji');

    const emoji = client.emojis.resolveIdentifier(item_emoji) ||
      client.emojis.resolve(item_emoji) ||
      guild.emojis.resolve(item_emoji) ||
      await guild.emojis.fetch(item_emoji).catch(() => null) ||
      null;

    const select = new MessageSelectMenu()
      .setCustomId()
      .setDisabled()
      .setOptions([{
        label,
        value,
        description,
        default: _default,
        emoji,
      }])
      .setPlaceholder();
  }
};