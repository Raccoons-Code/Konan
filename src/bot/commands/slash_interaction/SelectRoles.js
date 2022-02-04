const { SlashCommand } = require('../../classes');
const { Constants, MessageSelectMenu, MessageActionRow, MessageEmbed, Message } = require('discord.js');
const { ChannelTypes } = Constants;
const { GUILD_NEWS, GUILD_NEWS_THREAD, GUILD_PRIVATE_THREAD, GUILD_PUBLIC_THREAD, GUILD_STORE, GUILD_TEXT } = ChannelTypes;
const GuildTextChannelTypes = [GUILD_NEWS, GUILD_NEWS_THREAD, GUILD_PRIVATE_THREAD, GUILD_PUBLIC_THREAD, GUILD_STORE, GUILD_TEXT];

module.exports = class extends SlashCommand {
  constructor(...args) {
    super(...args);
    this.textRegexp = /(?:(?:([^|]{0,256}))(?:\|?(.{0,4096})))/;
    this.messageURLRegex = /(?:(?:\/)?(\d+))+/;
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
        .addStringOption(option => option.setName('menu_place_holder')
          .setDescription('Menu place holder'))
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
          .addStringOption(option => option.setName('message_id')
            .setDescription('Autocomplete | Message id | Message URL')
            .setAutocomplete(true)
            .setRequired(true))
          .addStringOption(option => option.setName('text')
            .setDescription('Text: Title | Description')
            .setRequired(true)))
        .addSubcommand(subcommand => subcommand.setName('menu')
          .setDescription('Edit select menu')
          .addChannelOption(option => option.setName('channel')
            .setDescription('Channel')
            .setRequired(true)
            .addChannelTypes(GuildTextChannelTypes))
          .addStringOption(option => option.setName('message_id')
            .setDescription('Autocomplete | Message id | Message URL')
            .setAutocomplete(true)
            .setRequired(true))
          .addBooleanOption(option => option.setName('menu_disabled')
            .setDescription('Set menu disabled'))
          .addStringOption(option => option.setName('menu_place_holder')
            .setDescription('Menu place holder'))));
  }

  async execute(interaction = this.CommandInteraction) {
    const { locale, memberPermissions, options } = interaction;

    if (!interaction.inGuild())
      return interaction.reply({
        content: this.t('Error! This command can only be used on one server.', { locale }),
        ephemeral: true,
      });

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
    const label = options.getString('item_name') || role.name;
    const description = options.getString('item_description');
    const _default = options.getBoolean('item_default');
    const item_emoji = options.getString('item_emoji');
    const menu_disabled = options.getBoolean('menu_disabled');
    const menu_place_holder = options.getString('menu_place_holder') || '';
    const [, title, embed_desc] = options.getString('text')?.match(this.textRegexp) || [];
    const channel = options.getChannel('channel') || interaction.channel;

    const emoji = client.emojis.resolveIdentifier(item_emoji) ||
      client.emojis.resolve(item_emoji) ||
      guild.emojis.resolve(item_emoji) ||
      await guild.emojis.fetch(item_emoji).catch(() => null) ||
      null;

    const newCustomId = {
      command: this.data.name,
      count: 0,
      date: Date.now(),
    };

    const value = JSON.stringify({
      count: 0,
      date: Date.now(),
      roleId: role.id,
    });

    const selectMenu = new MessageSelectMenu()
      .setCustomId(JSON.stringify(newCustomId))
      .setDisabled(menu_disabled)
      .setOptions([{
        label: `${label} 0`,
        value,
        description,
        default: _default,
        emoji,
      }])
      .setPlaceholder(menu_place_holder);

    const components = [new MessageActionRow().setComponents(selectMenu)];

    const embeds = [new MessageEmbed().setColor('RANDOM')
      .setTitle(title || embed_desc ? '' : 'SelectRoles')
      .setDescription(embed_desc || '')];

    channel.send({ components, embeds });
  }
};