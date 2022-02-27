const { SlashCommand } = require('../../structures');
const { Emoji, GuildChannel, MessageSelectMenu, MessageActionRow, MessageEmbed, Util } = require('discord.js');

module.exports = class extends SlashCommand {
  constructor(client) {
    super(client, {
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
          .setDescription('Item name {0,84} - default: <role>'))
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
          .addChannelTypes(this.GuildTextChannelTypes)))
      .addSubcommandGroup(subcommandgroup => subcommandgroup.setName('edit')
        .setDescription('Edit a Select menu role.')
        .addSubcommand(subcommand => subcommand.setName('message')
          .setDescription('Edit a text in a Select menu role.')
          .addChannelOption(option => option.setName('channel')
            .setDescription('Channel')
            .setRequired(true)
            .addChannelTypes(this.GuildTextChannelTypes))
          .addStringOption(option => option.setName('message_id')
            .setDescription('Message ID | Message URL')
            .setAutocomplete(true)
            .setRequired(true))
          .addStringOption(option => option.setName('text')
            .setDescription('Text: Title {1,256} | Description {0,4096}')
            .setRequired(true)))
        .addSubcommand(subcommand => subcommand.setName('menu')
          .setDescription('Edit a select menu.')
          .addChannelOption(option => option.setName('channel')
            .setDescription('Channel')
            .setRequired(true)
            .addChannelTypes(this.GuildTextChannelTypes))
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
            .addChannelTypes(this.GuildTextChannelTypes))
          .addStringOption(option => option.setName('message_id')
            .setDescription('Message ID | Message URL')
            .setAutocomplete(true)
            .setRequired(true))
          .addStringOption(option => option.setName('menu')
            .setDescription('Select a menu.')
            .setAutocomplete(true)
            .setRequired(true))
          .addStringOption(option => option.setName('item')
            .setDescription('Select a menu item.')
            .setAutocomplete(true)
            .setRequired(true))
          .addRoleOption(option => option.setName('role')
            .setDescription('Role'))
          .addStringOption(option => option.setName('item_name')
            .setDescription('Item name {0,84}'))
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
            .addChannelTypes(this.GuildTextChannelTypes))
          .addStringOption(option => option.setName('message_id')
            .setDescription('Message ID | Message URL')
            .setAutocomplete(true)
            .setRequired(true))
          .addStringOption(option => option.setName('menu')
            .setDescription('Select a menu.')
            .setAutocomplete(true)
            .setRequired(true))
          .addRoleOption(option => option.setName('role')
            .setDescription('Role')
            .setRequired(true))
          .addStringOption(option => option.setName('item_name')
            .setDescription('Item name {1,84} - default: <role>'))
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
            .addChannelTypes(this.GuildTextChannelTypes))
          .addStringOption(option => option.setName('message_id')
            .setDescription('Message ID | Message URL')
            .setAutocomplete(true)
            .setRequired(true))
          .addStringOption(option => option.setName('menu')
            .setDescription('Select a menu.')
            .setAutocomplete(true)
            .setRequired(true))
          .addStringOption(option => option.setName('item')
            .setDescription('Select a menu item.')
            .setAutocomplete(true)
            .setRequired(true))));
  }

  async execute(interaction = this.CommandInteraction) {
    const { locale, memberPermissions, options } = interaction;

    if (!interaction.inGuild())
      return await interaction.reply({
        content: this.t('onlyOnServer', { locale }),
        ephemeral: true,
      });

    const userPermissions = memberPermissions.missing(this.props.userPermissions);

    if (userPermissions.length) {
      if (interaction.isAutocomplete()) return await interaction.respond([]);

      return await interaction.reply({
        content: this.t('missingUserPermission', { locale, PERMISSIONS: userPermissions }),
        ephemeral: true,
      });
    }

    const command = options.getSubcommandGroup(false) || options.getSubcommand();

    if (interaction.isAutocomplete())
      return await this[`${command}Autocomplete`]?.(interaction);

    await interaction.deferReply({ ephemeral: true });

    await this[command]?.(interaction);
  }

  async setup(interaction = this.CommandInteraction) {
    const { locale, options } = interaction;

    const [, title, embed_desc] = options.getString('text')?.match(this.regexp.embed) || [];
    const channel = options.getChannel('channel') || interaction.channel;
    const description = options.getString('item_description')?.match(this.regexp.label)[1];
    const menu_place_holder = options.getString('menu_place_holder')?.match(this.regexp.label)[1] || '';
    const menu_disabled = options.getBoolean('menu_disabled');
    const emoji = options.getString('item_emoji');
    const role = options.getRole('role');
    const label = options.getString('item_name')?.match(this.regexp.labelLimit)[1] || role.name;

    const newCustomId = {
      c: this.data.name,
      count: 0,
      d: Date.now(),
    };

    const value = JSON.stringify({
      count: 0,
      d: Date.now(),
      roleId: role.id,
    });

    const selectMenu = new MessageSelectMenu()
      .setCustomId(JSON.stringify(newCustomId))
      .setDisabled(menu_disabled)
      .setMaxValues(1)
      .setOptions([{
        label: `${label} 0`,
        value,
        description,
        emoji,
      }])
      .setPlaceholder(menu_place_holder);

    const components = [new MessageActionRow().setComponents(selectMenu)];

    const embeds = [new MessageEmbed().setColor('RANDOM')
      .setTitle(title || embed_desc ? '' : 'SelectRoles')
      .setDescription(embed_desc?.replaceAll(/(\s{2})/g, '\n') || '')];

    try {
      await channel.send({ components, embeds });

      interaction.editReply(this.t('?created', { locale, string: 'Select Role' }));
    } catch {
      interaction.editReply(this.t('createError', { locale, string: 'Select Role' }));
    }
  }

  async edit(interaction = this.CommandInteraction) {
    const { locale, options } = interaction;

    const subcommand = options.getSubcommand();
    const channel = options.getChannel('channel');
    const message_id = options.getString('message_id');

    const message = await this.getMessageById(channel, message_id);

    if (!message) return await interaction.editReply(this.t('message404', { locale }));

    if (!message.editable) return await interaction.editReply(this.t('messageNotEditable', { locale }));

    if (subcommand === 'message') {
      const [, title, description] = options.getString('text').match(this.regexp.embed);

      const embeds = [new MessageEmbed()
        .setColor('RANDOM')
        .setDescription(description?.replaceAll(/(\s{2})/g, '\n') || '')
        .setTitle(title)];

      try {
        await message.edit({ embeds });

        return await interaction.editReply(this.t('?edited', { locale, string: 'Select Role' }));
      } catch {
        return await interaction.editReply(this.t('editError', { locale, string: 'Select Role' }));
      }
    }

    const menuId = options.getString('menu');

    if (subcommand === 'menu') {
      const menu_place_holder = options.getString('menu_place_holder')?.match(this.regexp.label)[1] || '';
      const menu_disabled = options.getBoolean('menu_disabled');

      const components = message.components.map(row => {
        if (row.components[0].type !== 'SELECT_MENU') return row;

        row.components.map((selectmenu, i) => {
          if (selectmenu.customId !== menuId && menuId.split(' |')[0] != (i + 1)) return selectmenu;

          const { disabled, placeholder } = selectmenu;

          selectmenu.setDisabled(typeof menu_disabled === 'boolean' ? menu_disabled : disabled)
            .setPlaceholder(menu_place_holder || placeholder);

          return selectmenu;
        });

        return row;
      });

      try {
        await message.edit({ components });

        return await interaction.editReply(this.t('?edited', { locale, string: 'Select Role' }));
      } catch {
        return await interaction.editReply(this.t('editError', { locale, string: 'Select Role' }));
      }
    }

    const item = options.getString('item');

    if (subcommand === 'item') {
      const role = options.getRole('role');
      const label = options.getString('item_name')?.match(this.regexp.labelLimit)[1];
      const description = options.getString('item_description')?.match(this.regexp.label)[1];
      const emoji = options.getString('item_emoji');

      const components = message.components.map(row => {
        if (row.components[0].type !== 'SELECT_MENU') return row;

        row.components.map((selectmenu, i) => {
          if (selectmenu.customId !== menuId && menuId.split(' |')[0] != (i + 1)) return selectmenu;

          selectmenu.options.map((option = this.MessageSelectOptionData) => {
            if (option.value !== item) return option;

            /** @type {optionValue} */
            const { count, d, date } = this.util.parseJSON(option.value);

            option.description = description ? description : option.description;
            option.emoji = emoji ? Util.resolvePartialEmoji(emoji) : option.emoji;
            option.label = label ? `${label} ${count}` : option.label;
            option.value = role ? JSON.stringify({ count, d: d || date, roleId: role.id }) : option.value;

            return option;
          });

          return selectmenu;
        });

        return row;
      });

      try {
        await message.edit({ components });

        return await interaction.editReply(this.t('?edited', { locale, string: 'Select Role' }));
      } catch {
        return await interaction.editReply(this.t('editError', { locale, string: 'Select Role' }));
      }
    }
  }

  async add(interaction = this.CommandInteraction) {
    const { locale, options } = interaction;

    const channel = options.getChannel('channel');
    const menuId = options.getString('menu');
    const message_id = options.getString('message_id');
    const subcommand = options.getSubcommand();

    const message = await this.getMessageById(channel, message_id);

    if (!message) return await interaction.editReply(this.t('message404', { locale }));

    if (!message.editable) return await interaction.editReply(this.t('messageNotEditable', { locale }));

    if (subcommand === 'item') {
      const role = options.getRole('role');
      const label = options.getString('item_name')?.match(this.regexp.labelLimit)[1] || role.name;
      const description = options.getString('item_description')?.match(this.regexp.label)[1];
      const emoji = options.getString('item_emoji');

      const value = JSON.stringify({
        count: 0,
        d: Date.now(),
        roleId: role.id,
      });

      const components = message.components.map(row => {
        if (row.components[0].type !== 'SELECT_MENU') return row;

        row.components.map((selectmenu, i) => {
          if (selectmenu.customId !== menuId && menuId.split(' |')[0] != (i + 1)) return selectmenu;

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

        return await interaction.editReply(this.t('itemAdded', { locale }));
      } catch {
        return await interaction.editReply(this.t('itemAddError', { locale }));
      }
    }
  }

  async remove(interaction = this.CommandInteraction) {
    const { locale, options } = interaction;

    const channel = options.getChannel('channel');
    const item = options.getString('item');
    const menuId = options.getString('menu');
    const message_id = options.getString('message_id');
    const subcommand = options.getSubcommand();

    const message = await this.getMessageById(channel, message_id);

    if (!message) return await interaction.editReply(this.t('message404', { locale }));

    if (!message.editable) return await interaction.editReply(this.t('messageNotEditable', { locale }));

    if (subcommand === 'item') {
      const components = message.components.map((row = this.MessageActionRow) => {
        if (row.components[0].type !== 'SELECT_MENU') return row;

        row.components.map((selectmenu, i) => {
          if (selectmenu.customId !== menuId && menuId.split(' |')[0] != (i + 1)) return selectmenu;

          selectmenu.options = selectmenu.options.filter(option => option.value !== item);

          selectmenu.setMaxValues(selectmenu.options.length);

          return selectmenu;
        });

      });

      try {
        await message.edit({ components });

        return await interaction.editReply(this.t('itemRemoved', { locale }));
      } catch {
        return await interaction.editReply(this.t('itemRemoveError', { locale }));
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
        m.components.some(c => c.components[0].type === 'SELECT_MENU') && regex.test(m.id));

      const messages_array = messages_filtered.toJSON();

      for (let i = 0; i < messages_array.length; i++) {
        const { embeds, id } = messages_array[i];

        const [embed] = embeds;

        const { title, description } = embed;

        const nameProps = [
          id,
          title ? `| ${title}` : '',
          description ? `| ${description}` : '',
        ];

        if (title || description)
          res.push({
            name: nameProps.join(' ').match(this.regexp.label)[1],
            value: `${id}`,
          });

        if (res.length === 25) break;
      }
    }

    if (focused.name === 'menu') {
      const message_id = options.getString('message_id');

      const message = await this.getMessageById(channel, message_id);

      if (!message) return await interaction.respond([]);

      if (!message.editable) return await interaction.respond([]);

      const { components } = message;

      for (let i = 0; i < components.length; i++) {
        const component = components[i];

        if (component.components[0].type !== 'SELECT_MENU') continue;

        for (let i2 = 0; i2 < component.components.length; i2++) {
          const element = component.components[i2];

          const { customId, disabled, maxValues, placeholder } = element;

          const menuProps = [
            `${i2 + 1}`,
            placeholder ? `| ${placeholder}` : '',
            `| ${maxValues} ${maxValues > 1 ? 'options' : 'option'}`,
            disabled ? '| disabled' : '',
          ];

          const menuName = menuProps.join(' ').trimStart();

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

      if (!message) return await interaction.respond([]);

      if (!message.editable) return await interaction.respond([]);

      const { components } = message;

      for (let i = 0; i < components.length; i++) {
        const component = components[i];

        if (component.components[0].type !== 'SELECT_MENU') continue;

        for (let i2 = 0; i2 < component.components.length; i2++) {
          const element = component.components[i2];

          const { customId, options: menuOptions } = element;

          if (customId !== menuId && menuId.split(' |')[0] != (i2 + 1)) continue;

          for (let i3 = 0; i3 < menuOptions.length; i3++) {
            const option = menuOptions[i3];

            const { description, emoji, label, value } = option;

            /** @type {optionValue} */
            const { roleId } = this.util.parseJSON(value);

            const role = await guild.roles.fetch(roleId);

            const optionProps = [
              emoji?.id ? '' : emoji?.name,
              label ? label : `Item ${i2 + 1}`,
              `| ${role?.name}`,
              `| ${roleId}`,
              description ? `| ${description}` : '',
            ];

            const optionName = optionProps.join(' ').trimStart();

            res.push({
              name: optionName.match(this.limitRegex)[1],
              value,
            });
          }
        }
      }
    }

    await interaction.respond(res);
  }

  async addAutocomplete(interaction = this.AutocompleteInteraction) {
    return await this.editAutocomplete(interaction);
  }

  async removeAutocomplete(interaction = this.AutocompleteInteraction) {
    return await this.editAutocomplete(interaction);
  }
};

/**
 * @typedef customId
 * @property {string} c command
 * @property {number} count
 * @property {number} d date
 */

/**
 * @typedef optionValue
 * @property {number} count
 * @property {number} d date
 * @property {string} roleId
 */