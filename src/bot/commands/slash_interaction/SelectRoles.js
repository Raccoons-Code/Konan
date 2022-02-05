const { SlashCommand } = require('../../classes');
const { Constants, GuildChannel, MessageSelectMenu, MessageActionRow, MessageEmbed, Message } = require('discord.js');
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
          .addStringOption(option => option.setName('menu')
            .setDescription('Autocomplete')
            .setAutocomplete(true)
            .setRequired(true))
          .addBooleanOption(option => option.setName('menu_disabled')
            .setDescription('Set menu disabled'))
          .addStringOption(option => option.setName('menu_place_holder')
            .setDescription('Menu place holder')))
        .addSubcommand(subcommand => subcommand.setName('item')
          .setDescription('Edit selete menu item')
          .addChannelOption(option => option.setName('channel')
            .setDescription('Channel')
            .setRequired(true)
            .addChannelTypes(GuildTextChannelTypes))
          .addStringOption(option => option.setName('message_id')
            .setDescription('Autocomplete | Message id | Message URL')
            .setAutocomplete(true)
            .setRequired(true))
          .addStringOption(option => option.setName('menu')
            .setDescription('Menu')
            .setAutocomplete(true)
            .setRequired(true))
          .addStringOption(option => option.setName('item')
            .setDescription('Menu item')
            .setAutocomplete(true)
            .setRequired(true))
          .addStringOption(option => option.setName('item_name')
            .setDescription('Item name'))
          .addStringOption(option => option.setName('item_description')
            .setDescription('Item description'))
          .addBooleanOption(option => option.setName('item_default')
            .setDescription('Set item default'))
          .addStringOption(option => option.setName('item_emoji')
            .setDescription('Item emoji'))));
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

    const channel = options.getChannel('channel') || interaction.channel;
    const [, title, embed_desc] = options.getString('text')?.match(this.textRegexp) || [];
    const menu_place_holder = options.getString('menu_place_holder')?.match(/(.{1,100})/)[1] || '';
    const menu_disabled = options.getBoolean('menu_disabled');
    const role = options.getRole('role');
    const label = options.getString('item_name') || role.name;
    const description = options.getString('item_description')?.match(/(.{1,100})/)[1];
    const _default = options.getBoolean('item_default');
    const item_emoji = options.getString('item_emoji');

    const emoji = client.emojis.resolveIdentifier(item_emoji) ||
      client.emojis.resolve(item_emoji) ||
      guild.emojis.resolve(item_emoji) ||
      await guild.emojis.fetch(item_emoji).catch(() => null) || null;

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
      .setTitle(title ? title : embed_desc ? '' : 'SelectRoles')
      .setDescription(embed_desc || '')];

    channel.send({ components, embeds });
  }

  async editAutocomplete(interaction = this.AutocompleteInteraction) {
    if (interaction.responded) return;

    const { client, guild, options } = interaction;

    const channelId = options.get('channel').value;

    const channel = guild.channels.resolve(channelId) || await guild.channels.fetch(channelId);

    const focused = options.getFocused(true);
    const regex = RegExp(focused.value, 'i');

    const res = [];

    if (focused.name === 'message_id') {
      const messages = channel.messages.cache.size ? channel.messages.cache : await channel.messages.fetch();

      const messages_filtered = messages.filter(m => m.author.id === client.user.id &&
        m.embeds.length && m.components.some(c => c.components[0].type === 'SELECT_MENU') ?
        focused.value.length && regex.test(m.id) || regex.test(m.embeds[0]?.title) ||
        regex.test(m.embeds[0]?.description) : false);

      const messages_array = messages_filtered.toJSON();

      for (let i = 0; i < messages_array.length; i++) {
        const message = messages_array[i];

        const { embeds, id } = message;

        const [embed] = embeds;

        const title = embed?.title?.slice(0, 20);

        const description = embed?.description?.slice(0, 20);

        if (title || description)
          res.push({
            name: `${id}`,
            value: `${id}`,
          });

        if (res.length === 25) break;
      }
    }

    if (focused.name === 'menu') {
      const message_id = options.getString('message_id');

      const message = await this.getMessageById(channel, message_id);

      if (!message) return interaction.respond([]);

      if (!message.editable) return interaction.respond([]);

      const { components } = message;

      for (let i = 0; i < components.length; i++) {
        const component = components[i];

        if (component.components[0].type !== 'SELECT_MENU') continue;

        for (let i2 = 0; i2 < component.components.length; i2++) {
          const element = component.components[i2];

          const { customId, placeholder } = element;

          const { rolesId } = JSON.parse(customId);

          const roles = rolesId.map(roleId => guild.roles.resolve(roleId).name);

          const menuName = `${placeholder ? placeholder : `Menu ${i2 + 1}`} | Roles: ${roles.join(' - ')}`;

          res.push({
            name: menuName.match(/(.{1,100})/)[1],
            value: customId,
          });
        }
      }
    }

    if (focused.name === 'item') {
      const message_id = options.getString('message_id');
      const menuId = options.getString('menu');

      const message = await this.getMessageById(channel, message_id);

      if (!message) return interaction.respond([]);

      if (!message.editable) return interaction.respond([]);

      const { components } = message;

      for (let i = 0; i < components.length; i++) {
        const component = components[i];

        if (component.components[0].type !== 'SELECT_MENU') continue;

        for (let i2 = 0; i2 < component.components.length; i2++) {
          const element = component.components[i2];

          if (element.customId !== menuId) continue;

          const { options: menuOptions } = element;

          for (let i3 = 0; i3 < menuOptions.length; i3++) {
            const option = menuOptions[i3];

            const { default: _default, description, emoji, label, value } = option;

            const { roleId } = this.util.parseJSON(value);

            const role = guild.roles.resolve(roleId);

            const optionName = `${emoji ? `${emoji} ` : ''}${label} | ${role.id}${_default ? ' | default' : ''}${description ? ` | ${description}` : ''}`;

            res.push({
              name: optionName.match(/(.{1,100})/)[1],
              value: value,
            });
          }
        }
      }
    }

    interaction.respond(res);
  }
};