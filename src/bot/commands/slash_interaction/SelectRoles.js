const { SlashCommand } = require('../../classes');
const { Constants, GuildChannel, MessageSelectMenu, MessageActionRow, MessageEmbed, Message } = require('discord.js');
const { ChannelTypes } = Constants;
const { GUILD_NEWS, GUILD_NEWS_THREAD, GUILD_PRIVATE_THREAD, GUILD_PUBLIC_THREAD, GUILD_STORE, GUILD_TEXT } = ChannelTypes;
const GuildTextChannelTypes = [GUILD_NEWS, GUILD_NEWS_THREAD, GUILD_PRIVATE_THREAD, GUILD_PUBLIC_THREAD, GUILD_STORE, GUILD_TEXT];

module.exports = class extends SlashCommand {
  constructor(...args) {
    super(...args, {
      clientPermissions: ['EMBED_LINKS', 'MANAGE_ROLES', 'SEND_MESSAGES'],
      userPermissions: ['MANAGE_ROLES'],
    });
    this.data = this.setName('selectroles')
      .setDescription('Select menu roles.')
      .addSubcommand(subcommand => subcommand.setName('setup')
        .setDescription('New Select menu role.')
        .addRoleOption(option => option.setName('role')
          .setDescription('Role')
          .setRequired(true))
        .addStringOption(option => option.setName('item_name')
          .setDescription('Item name {0,90} - default: <role>'))
        .addStringOption(option => option.setName('item_description')
          .setDescription('Item description {0,100}'))
        .addStringOption(option => option.setName('item_emoji')
          .setDescription('Item emoji'))
        .addBooleanOption(option => option.setName('menu_disabled')
          .setDescription('Set menu disabled - default: false'))
        .addStringOption(option => option.setName('menu_place_holder')
          .setDescription('Menu place holder'))
        .addStringOption(option => option.setName('text')
          .setDescription('Text: Title {0,256} | Description {0,4096} - default: SelectRoles'))
        .addChannelOption(option => option.setName('channel')
          .setDescription('Channel - default: <current channel>')
          .addChannelTypes(GuildTextChannelTypes)))
      .addSubcommandGroup(subcommandgroup => subcommandgroup.setName('edit')
        .setDescription('Edit a Select menu role.')
        .addSubcommand(subcommand => subcommand.setName('message')
          .setDescription('Edit a text in a Select menu role.')
          .addChannelOption(option => option.setName('channel')
            .setDescription('Channel')
            .setRequired(true)
            .addChannelTypes(GuildTextChannelTypes))
          .addStringOption(option => option.setName('message_id')
            .setDescription('Message ID | Message URL')
            .setAutocomplete(true)
            .setRequired(true))
          .addStringOption(option => option.setName('text')
            .setDescription('Text: Title {1,256} | Description {0,4096}')
            .setRequired(true)))
        .addSubcommand(subcommand => subcommand.setName('menu')
          .setDescription('Edit select menu')
          .addChannelOption(option => option.setName('channel')
            .setDescription('Channel')
            .setRequired(true)
            .addChannelTypes(GuildTextChannelTypes))
          .addStringOption(option => option.setName('message_id')
            .setDescription('Message ID | Message URL')
            .setAutocomplete(true)
            .setRequired(true))
          .addStringOption(option => option.setName('menu')
            .setDescription('Select menu')
            .setAutocomplete(true)
            .setRequired(true))
          .addBooleanOption(option => option.setName('menu_disabled')
            .setDescription('Set menu disabled'))
          .addStringOption(option => option.setName('menu_place_holder')
            .setDescription('Menu place holder')))
        .addSubcommand(subcommand => subcommand.setName('item')
          .setDescription('Edit a selete menu item.')
          .addChannelOption(option => option.setName('channel')
            .setDescription('Channel')
            .setRequired(true)
            .addChannelTypes(GuildTextChannelTypes))
          .addStringOption(option => option.setName('message_id')
            .setDescription('Message ID | Message URL')
            .setAutocomplete(true)
            .setRequired(true))
          .addStringOption(option => option.setName('menu')
            .setDescription('Select menu')
            .setAutocomplete(true)
            .setRequired(true))
          .addStringOption(option => option.setName('item')
            .setDescription('Select menu item')
            .setAutocomplete(true)
            .setRequired(true))
          .addRoleOption(option => option.setName('role')
            .setDescription('Role'))
          .addStringOption(option => option.setName('item_name')
            .setDescription('Item name {0,90}'))
          .addStringOption(option => option.setName('item_description')
            .setDescription('Item description {0,100}'))
          .addStringOption(option => option.setName('item_emoji')
            .setDescription('Item emoji'))))
      .addSubcommandGroup(subcommandgroup => subcommandgroup.setName('add')
        .setDescription('Add to Select menu.')
        .addSubcommand(subcommand => subcommand.setName('item')
          .setDescription('Add a item in a Select menu.')
          .addChannelOption(option => option.setName('channel')
            .setDescription('Channel')
            .setRequired(true)
            .addChannelTypes(GuildTextChannelTypes))
          .addStringOption(option => option.setName('message_id')
            .setDescription('Message ID | Message URL')
            .setAutocomplete(true)
            .setRequired(true))
          .addStringOption(option => option.setName('menu')
            .setDescription('Select menu')
            .setAutocomplete(true)
            .setRequired(true))
          .addRoleOption(option => option.setName('role')
            .setDescription('Role')
            .setRequired(true))
          .addStringOption(option => option.setName('item_name')
            .setDescription('Item name {1,90} - default: <role>'))
          .addStringOption(option => option.setName('item_description')
            .setDescription('Item description {1,100}'))
          .addStringOption(option => option.setName('item_emoji')
            .setDescription('Item emoji'))))
      .addSubcommandGroup(subcommandgroup => subcommandgroup.setName('remove')
        .setDescription('Remove from a Select menu.')
        .addSubcommand(subcommand => subcommand.setName('item')
          .setDescription('Remove a item in a Select menu.')
          .addChannelOption(option => option.setName('channel')
            .setDescription('Channel')
            .setRequired(true)
            .addChannelTypes(GuildTextChannelTypes))
          .addStringOption(option => option.setName('message_id')
            .setDescription('Message ID | Message URL')
            .setAutocomplete(true)
            .setRequired(true))
          .addStringOption(option => option.setName('menu')
            .setDescription('Select menu')
            .setAutocomplete(true)
            .setRequired(true))
          .addStringOption(option => option.setName('item')
            .setDescription('Select menu item')
            .setAutocomplete(true)
            .setRequired(true))));
  }

  async execute(interaction = this.CommandInteraction) {
    const { locale, memberPermissions, options } = interaction;

    if (!interaction.inGuild())
      return interaction.reply({
        content: this.t('onlyOnServer', { locale }),
        ephemeral: true,
      });

    const userPermissions = memberPermissions.missing(this.props.userPermissions);

    if (userPermissions.length) {
      if (interaction.isAutocomplete()) return interaction.respond([]);

      return interaction.reply({
        content: this.t('missingUserPermission', { locale, PERMISSIONS: userPermissions }),
        ephemeral: true,
      });
    }

    const command = options.getSubcommandGroup(false) || options.getSubcommand();

    if (interaction.isAutocomplete())
      return this[`${command}Autocomplete`]?.(interaction);

    await interaction.deferReply({ ephemeral: true });

    this[command]?.(interaction);
  }

  async setup(interaction = this.CommandInteraction) {
    const { client, guild, locale, options } = interaction;

    const [, title, embed_desc] = options.getString('text')?.match(this.textRegexp) || [];
    const channel = options.getChannel('channel') || interaction.channel;
    const description = options.getString('item_description')?.match(this.limitRegex)[1];
    const menu_place_holder = options.getString('menu_place_holder')?.match(this.limitRegex)[1] || '';
    const menu_disabled = options.getBoolean('menu_disabled');
    const item_emoji = options.getString('item_emoji');
    const role = options.getRole('role');
    const label = options.getString('item_name')?.match(this.labelRegex)[1] || role.name;

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
        emoji,
      }])
      .setPlaceholder(menu_place_holder)
      .setMaxValues(1);

    const components = [new MessageActionRow().setComponents(selectMenu)];

    const embeds = [new MessageEmbed().setColor('RANDOM')
      .setTitle(title ? title : embed_desc ? '' : 'SelectRoles')
      .setDescription(embed_desc || '')];

    try {
      await channel.send({ components, embeds });
      interaction.editReply(this.t('?created', { locale, string: 'Select Role' }));
    } catch {
      interaction.editReply(this.t('createError', { locale, string: 'Select Role' }));
    }
  }

  async edit(interaction = this.CommandInteraction) {
    const { client, guild, locale, options } = interaction;

    const subcommand = options.getSubcommand();
    const channel = options.getChannel('channel');
    const message_id = options.getString('message_id');

    const message = await this.getMessageById(channel, message_id);

    if (!message) return interaction.editReply(this.t('message404', { locale }));

    if (!message.editable) return interaction.respond(this.t('messageNotEditable', { locale }));

    if (subcommand === 'message') {
      const [, title, description] = options.getString('text').match(this.textRegexp);

      const embeds = [new MessageEmbed().setColor('RANDOM')
        .setTitle(title)
        .setDescription(description)];

      try {
        await message.edit({ embeds });
        return interaction.editReply(this.t('?edited', { locale, string: 'Select Role' }));
      } catch {
        return interaction.editReply(this.t('editError', { locale, string: 'Select Role' }));
      }
    }

    const menu = options.getString('menu');

    if (subcommand === 'menu') {
      const menu_place_holder = options.getString('menu_place_holder')?.match(this.limitRegex)[1] || '';
      const menu_disabled = options.getBoolean('menu_disabled');

      const components = message.components.map(row => {
        if (row.components[0].type !== 'SELECT_MENU') return row;

        row.components.map(selectmenu => {
          if (selectmenu.customId !== menu) return selectmenu;

          selectmenu.setDisabled(menu_disabled)
            .setPlaceholder(menu_place_holder);

          return selectmenu;
        });

        return row;
      });

      try {
        await message.edit({ components });
        return interaction.editReply(this.t('?edited', { locale, string: 'Select Role' }));
      } catch {
        return interaction.editReply(this.t('editError', { locale, string: 'Select Role' }));
      }
    }

    const item = options.getString('item');

    if (subcommand === 'item') {
      const role = options.getRole('role');
      const label = options.getString('item_name')?.match(this.labelRegex)[1];
      const description = options.getString('item_description')?.match(this.limitRegex)[1];
      const item_emoji = options.getString('item_emoji');

      const emoji = item_emoji ? client.emojis.resolveIdentifier(item_emoji) ||
        client.emojis.resolve(item_emoji) ||
        guild.emojis.resolve(item_emoji) ||
        await guild.emojis.fetch(item_emoji).catch(() => null) || null : null;

      const components = message.components.map(row => {
        if (row.components[0].type !== 'SELECT_MENU') return row;

        row.components.map(selectmenu => {
          if (selectmenu.customId !== menu) return selectmenu;

          selectmenu.options.map((option = this.MessageSelectOptionData) => {
            if (option.value !== item) return option;

            /** @type {optionValue} */
            const { count, date } = this.util.parseJSON(option.value);

            option.description = description ? description : option.description;
            option.emoji = emoji ? `${emoji}` : option.emoji;
            option.label = label ? `${label} ${count}` : option.label;
            option.value = role ? JSON.stringify({ count, date, roleId: role.id }) : option.value;

            return option;
          });

          return selectmenu;
        });

        return row;
      });

      try {
        await message.edit({ components });
        return interaction.editReply(this.t('?edited', { locale, string: 'Select Role' }));
      } catch {
        return interaction.editReply(this.t('editError', { locale, string: 'Select Role' }));
      }
    }
  }

  async add(interaction = this.CommandInteraction) {
    const { client, guild, locale, options } = interaction;

    const channel = options.getChannel('channel');
    const menu = options.getString('menu');
    const message_id = options.getString('message_id');
    const subcommand = options.getSubcommand();

    const message = await this.getMessageById(channel, message_id);

    if (!message) return interaction.editReply(this.t('message404', { locale }));

    if (!message.editable) return interaction.respond(this.t('messageNotEditable', { locale }));

    if (subcommand === 'item') {
      const role = options.getRole('role');
      const label = options.getString('item_name')?.match(this.labelRegex)[1] || role.name;
      const description = options.getString('item_description')?.match(this.limitRegex)[1];
      const item_emoji = options.getString('item_emoji');

      const emoji = client.emojis.resolveIdentifier(item_emoji) ||
        client.emojis.resolve(item_emoji) ||
        guild.emojis.resolve(item_emoji) ||
        await guild.emojis.fetch(item_emoji).catch(() => null) || null;

      const value = JSON.stringify({
        count: 0,
        date: Date.now(),
        roleId: role.id,
      });

      const components = message.components.map(row => {
        if (row.components[0].type !== 'SELECT_MENU') return row;

        row.components.map(selectmenu => {
          if (selectmenu.customId !== menu) return selectmenu;

          selectmenu.addOptions([{
            label: `${label} 0`,
            value,
            description,
            emoji,
          }])
            .setMaxValues(selectmenu.options.length);

          return selectmenu;
        });

        return row;
      });

      try {
        await message.edit({ components });
        return interaction.editReply(this.t('itemAdded', { locale }));
      } catch {
        return interaction.editReply(this.t('itemAddError', { locale }));
      }
    }
  }

  async remove(interaction = this.CommandInteraction) {
    const { locale, options } = interaction;

    const channel = options.getChannel('channel');
    const item = options.getString('item');
    const menu = options.getString('menu');
    const message_id = options.getString('message_id');
    const subcommand = options.getSubcommand();

    const message = await this.getMessageById(channel, message_id);

    if (!message) return interaction.editReply(this.t('message404', { locale }));

    if (!message.editable) return interaction.respond(this.t('messageNotEditable', { locale }));

    if (subcommand === 'item') {
      const components = message.components.map((row = this.MessageActionRow) => {
        if (row.components[0].type !== 'SELECT_MENU') return row;

        row.components.map(selectmenu => {
          if (selectmenu.customId !== menu) return selectmenu;

          selectmenu.options = selectmenu.options.filter(option => option.value !== item);

          selectmenu.setMaxValues(selectmenu.options.length);

          return selectmenu;
        });

        return row;
      });

      try {
        await message.edit({ components });
        return interaction.editReply(this.t('itemRemoved', { locale }));
      } catch {
        return interaction.editReply(this.t('itemRemoveError', { locale }));
      }
    }
  }

  async editAutocomplete(interaction = this.AutocompleteInteraction, res = []) {
    if (interaction.responded) return;

    const { client, guild, options } = interaction;

    const channelId = options.get('channel').value;

    const channel = await guild.channels.fetch(channelId);

    const focused = options.getFocused(true);
    const regex = RegExp(focused.value, 'i');

    if (focused.name === 'message_id') {
      const messages = await channel.messages.fetch();

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

          const menuName = `${placeholder ? placeholder : `Menu ${i2 + 1}`}`;

          if (regex.test(menuName))
            res.push({
              name: menuName.match(this.limitRegex)[1],
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

            const { description, emoji, label, value } = option;

            /** @type {optionValue} */
            const { roleId } = this.util.parseJSON(value);

            const role = guild.roles.resolve(roleId);

            const optionName = `${emoji ? `${emoji} ` : ''}${label} | ${role?.name} | ${roleId}${description ? ` | ${description}` : ''}`;

            res.push({
              name: optionName.match(this.limitRegex)[1],
              value,
            });
          }
        }
      }
    }

    interaction.respond(res);
  }

  async addAutocomplete(interaction = this.AutocompleteInteraction) {
    this.editAutocomplete(interaction);
  }

  async removeAutocomplete(interaction = this.AutocompleteInteraction) {
    this.editAutocomplete(interaction);
  }
};

/**
 * @typedef customId
 * @property {string} command
 * @property {number} count
 * @property {number} date
 */

/**
 * @typedef optionValue
 * @property {number} count
 * @property {number} date
 * @property {string} roleId
 */