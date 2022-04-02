import { SlashCommandBuilder } from '@discordjs/builders';
import { ApplicationCommandOptionChoice, AutocompleteInteraction, CommandInteraction, EmojiIdentifierResolvable, MessageActionRow, MessageEmbed, MessageSelectMenu, PermissionString, TextChannel, Util } from 'discord.js';
import { Client, SlashCommand } from '../../structures';

export interface SelectRolesCustomId {
  /** command */
  c: string
  count: number
  /** date */
  d: number
}

export interface SelectRolesItemOptionValue {
  count: number
  /** date */
  d: number
  roleId: string
}

export default class SelectRoles extends SlashCommand {
  constructor(client: Client) {
    super(client, {
      clientPermissions: ['EMBED_LINKS', 'MANAGE_ROLES', 'SEND_MESSAGES'],
      userPermissions: ['MANAGE_ROLES'],
    });

    this.data = new SlashCommandBuilder().setName('selectroles')
      .setDescription('A command to create a select menu for roles.')
      .addSubcommand(subcommand => subcommand.setName('setup')
        .setDescription('Create a select menu for roles.')
        .addRoleOption(option => option.setName('role')
          .setDescription('Role.')
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
          .addChannelTypes(this.GuildTextChannelTypes as any)))
      .addSubcommandGroup(subcommandgroup => subcommandgroup.setName('edit')
        .setDescription('Edit a select menu for roles.')
        .addSubcommand(subcommand => subcommand.setName('message')
          .setDescription('Edit a text in a Select menu role.')
          .addChannelOption(option => option.setName('channel')
            .setDescription('Channel')
            .setRequired(true)
            .addChannelTypes(this.GuildTextChannelTypes as any))
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
            .addChannelTypes(this.GuildTextChannelTypes as any))
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
            .addChannelTypes(this.GuildTextChannelTypes as any))
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
        .addSubcommand(subcommand => subcommand.setName('menu')
          .setDescription('Add a Select menu.')
          .addChannelOption(option => option.setName('channel')
            .setDescription('Channel')
            .setRequired(true)
            .addChannelTypes(this.GuildTextChannelTypes as any))
          .addStringOption(option => option.setName('message_id')
            .setDescription('Message ID | Message URL')
            .setAutocomplete(true)
            .setRequired(true))
          .addRoleOption(option => option.setName('role')
            .setDescription('Role.')
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
            .setDescription('Menu place holder')))
        .addSubcommand(subcommand => subcommand.setName('item')
          .setDescription('Add a item in a Select menu.')
          .addChannelOption(option => option.setName('channel')
            .setDescription('Channel')
            .setRequired(true)
            .addChannelTypes(this.GuildTextChannelTypes as any))
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
        .addSubcommand(subcommand => subcommand.setName('menu')
          .setDescription('Remove a Select menu.')
          .addChannelOption(option => option.setName('channel')
            .setDescription('Channel')
            .setRequired(true)
            .addChannelTypes(this.GuildTextChannelTypes as any))
          .addStringOption(option => option.setName('message_id')
            .setDescription('Message ID | Message URL')
            .setAutocomplete(true)
            .setRequired(true))
          .addStringOption(option => option.setName('menu')
            .setDescription('Select a menu.')
            .setAutocomplete(true)
            .setRequired(true)))
        .addSubcommand(subcommand => subcommand.setName('item')
          .setDescription('Remove a item in a Select menu.')
          .addChannelOption(option => option.setName('channel')
            .setDescription('Channel')
            .setRequired(true)
            .addChannelTypes(this.GuildTextChannelTypes as any))
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

  async execute(interaction: CommandInteraction | AutocompleteInteraction): Promise<any> {
    const { locale } = interaction;

    if (!interaction.inCachedGuild()) {
      if (interaction.isAutocomplete()) return await interaction.respond([]);

      return await interaction.editReply(this.t('onlyOnServer', { locale }));
    }

    const { memberPermissions, options } = interaction;

    const userPermissions = memberPermissions.missing(this.props?.userPermissions as PermissionString[]) ?? [];

    if (userPermissions.length) {
      if (interaction.isAutocomplete()) return await interaction.respond([]);

      return await interaction.reply({
        content: this.t('missingUserPermission', { locale, PERMISSIONS: userPermissions }),
        ephemeral: true,
      });
    }

    const subcommand = <'edit'>options.getSubcommandGroup(false) ?? options.getSubcommand();

    if (interaction.isAutocomplete())
      return await this[`${subcommand}Autocomplete`]?.(interaction);

    await interaction.deferReply({ ephemeral: true });

    await this[subcommand]?.(interaction);
  }

  async setup(interaction: CommandInteraction) {
    const { locale, options } = interaction;

    const [, title, embed_description] = options.getString('text')?.match(this.pattern.embed) ?? [];
    const channel = <TextChannel>options.getChannel('channel') ?? interaction.channel;
    const description = options.getString('item_description')?.match(this.pattern.label)?.[1];
    const emoji = <EmojiIdentifierResolvable>options.getString('item_emoji');
    const menu_disabled = <boolean>options.getBoolean('menu_disabled');
    const menu_place_holder = options.getString('menu_place_holder')?.match(this.pattern.label)?.[1] || '';
    const role = options.getRole('role', true);
    const label = options.getString('item_name')?.match(this.pattern.labelLimited)?.[1] ?? role.name;

    const selectMenu = new MessageSelectMenu()
      .setCustomId(JSON.stringify({
        c: this.data.name,
        count: 0,
        d: Date.now(),
      }))
      .setDisabled(menu_disabled)
      .setMaxValues(1)
      .setOptions([{
        label: `${label} 0`,
        value: JSON.stringify({
          count: 0,
          roleId: role.id,
        }),
        description,
        emoji: emoji,
      }])
      .setPlaceholder(menu_place_holder);

    const components = [new MessageActionRow().setComponents(selectMenu)];

    const embeds = [new MessageEmbed()
      .setColor('RANDOM')
      .setDescription(embed_description ? embed_description.replace(/(\s{2})/g, '\n') : '')
      .setTitle(title ? title : embed_description ? '' : 'SelectRoles')];

    try {
      await channel.send({ components, embeds });

      await interaction.editReply(this.t('?created', { locale, string: 'Select Role' }));
    } catch {
      await interaction.editReply(this.t('createError', { locale, string: 'Select Role' }));
    }
  }

  async edit(interaction: CommandInteraction): Promise<any> {
    const { locale, options } = interaction;

    const channel = <TextChannel>options.getChannel('channel', true);
    const message_id = <string>options.getString('message_id', true).match(this.pattern.messageURL)?.[1];

    const message = await channel.messages.fetch(message_id);

    if (!message) return await interaction.editReply(this.t('message404', { locale }));

    if (!message.editable) return await interaction.editReply(this.t('messageNotEditable', { locale }));

    const subcommand = options.getSubcommand();

    if (subcommand === 'message') {
      const [, title, description] = options.getString('text', true).match(this.pattern.embed) ?? [];

      const embeds = [new MessageEmbed()
        .setColor('RANDOM')
        .setDescription(description ? description.replace(/(\s{2})/g, '\n') : '')
        .setTitle(title || '')];

      try {
        await message.edit({ embeds });

        return await interaction.editReply(this.t('?edited', { locale, string: 'Select Role' }));
      } catch {
        return await interaction.editReply(this.t('editError', { locale, string: 'Select Role' }));
      }
    }

    const menuId = options.getString('menu', true);

    if (subcommand === 'menu') {
      const menu_disabled = options.getBoolean('menu_disabled');
      const menu_place_holder = options.getString('menu_place_holder')?.match(this.pattern.label)?.[1];

      const components = message.components.map(row => {
        if (row.components[0].type !== 'SELECT_MENU') return row;

        row.components.map(selectmenu => {
          if (selectmenu.customId !== menuId || selectmenu.type !== 'SELECT_MENU') return selectmenu;

          const { disabled, placeholder } = selectmenu;

          selectmenu.setDisabled(typeof menu_disabled === 'boolean' ? menu_disabled : disabled)
            .setPlaceholder(<string>menu_place_holder ?? placeholder);

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

    const item = options.getString('item', true);

    if (subcommand === 'item') {
      const role = options.getRole('role');

      if (role ? message.components.some(row => row.components.some(element => {
        if (element.type === 'BUTTON')
          return JSON.parse(`${element.customId}`).roleId === role?.id;

        return element.options.some(option => JSON.parse(`${option.value}`).roleId === role?.id);
      })) : false) return await interaction.editReply(this.t('itemAddError', { locale }));

      const description = options.getString('item_description')?.match(this.pattern.label)?.[1];
      const emoji = options.getString('item_emoji');
      const label = options.getString('item_name')?.match(this.pattern.labelLimited)?.[1];

      const components = message.components.map(row => {
        if (row.components[0].type !== 'SELECT_MENU') return row;

        row.components.map(selectmenu => {
          if (selectmenu.customId !== menuId || selectmenu.type !== 'SELECT_MENU') return selectmenu;

          selectmenu.options.map(option => {
            if (option.value !== item) return option;

            const { count, d } = <SelectRolesItemOptionValue>JSON.parse(option.value);

            option.description = description ? description : option.description;
            option.emoji = emoji ? Util.resolvePartialEmoji(emoji) : <any>option.emoji;
            option.label = label ? `${label} ${count}` : option.label;
            option.value = role ? JSON.stringify({ count, d: d, roleId: role.id }) : option.value;

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

  async add(interaction: CommandInteraction): Promise<any> {
    const { locale, options } = interaction;

    const channel = <TextChannel>options.getChannel('channel', true);
    const message_id = <string>options.getString('message_id', true).match(this.pattern.messageURL)?.[1];

    const message = await channel.messages.fetch(message_id);

    if (!message) return await interaction.editReply(this.t('message404', { locale }));

    if (!message.editable) return await interaction.editReply(this.t('messageNotEditable', { locale }));

    const role = options.getRole('role', true);

    if (message.components.some(row => row.components.some(element => {
      if (element.type === 'BUTTON')
        return JSON.parse(`${element.customId}`).roleId === role?.id;

      return element.options.some(option => JSON.parse(`${option.value}`).roleId === role?.id);
    }))) return await interaction.editReply(this.t('itemAddError', { locale }));

    const description = options.getString('item_description')?.match(this.pattern.label)?.[1];
    const emoji = <EmojiIdentifierResolvable>options.getString('item_emoji');
    const label = options.getString('item_name')?.match(this.pattern.labelLimited)?.[1] ?? role.name;

    const subcommand = options.getSubcommand();

    if (subcommand === 'menu') {
      const menu_disabled = <boolean>options.getBoolean('menu_disabled');
      const menu_place_holder = options.getString('menu_place_holder')?.match(this.pattern.label)?.[1] || '';

      const selectMenu = new MessageSelectMenu()
        .setCustomId(JSON.stringify({
          c: this.data.name,
          count: 0,
          d: Date.now(),
        }))
        .setDisabled(menu_disabled)
        .setMaxValues(1)
        .setOptions([{
          label: `${label} 0`,
          value: JSON.stringify({
            count: 0,
            roleId: role.id,
          }),
          description,
          emoji: emoji,
        }])
        .setPlaceholder(menu_place_holder);

      message.components.push(new MessageActionRow().setComponents([selectMenu]));

      try {
        await message.edit({ components: message.components });

        return await interaction.editReply(this.t('itemAdded', { locale }));
      } catch {
        return await interaction.editReply(this.t('itemAddError', { locale }));
      }
    }

    if (subcommand === 'item') {
      const menuId = options.getString('menu', true);

      message.components.map(row => {
        if (row.components[0].type !== 'SELECT_MENU') return row;

        row.components.map(selectmenu => {
          if (selectmenu.customId !== menuId || selectmenu.type !== 'SELECT_MENU') return selectmenu;

          selectmenu.addOptions([{
            label: `${label} 0`,
            value: JSON.stringify({
              count: 0,
              roleId: role.id,
            }),
            description,
            emoji: emoji,
          }])
            .setMaxValues(selectmenu.options.length);

          return selectmenu;
        });

        return row;
      });

      try {
        await message.edit({ components: message.components });

        return await interaction.editReply(this.t('itemAdded', { locale }));
      } catch {
        return await interaction.editReply(this.t('itemAddError', { locale }));
      }
    }
  }

  async remove(interaction: CommandInteraction): Promise<any> {
    const { locale, options } = interaction;

    const channel = <TextChannel>options.getChannel('channel', true);
    const message_id = <string>options.getString('message_id', true).match(this.pattern.messageURL)?.[1];

    const message = await channel.messages.fetch(message_id);

    if (!message) return await interaction.editReply(this.t('message404', { locale }));

    if (!message.editable) return await interaction.editReply(this.t('messageNotEditable', { locale }));

    const subcommand = options.getSubcommand();

    const menuId = options.getString('menu', true);

    if (subcommand === 'menu') {
      message.components = message.components.filter(row =>
        row.components[0].type !== 'SELECT_MENU' ||
        row.components.some(selectmenu => selectmenu.customId !== menuId));

      try {
        await message.edit({ components: message.components });

        return await interaction.editReply(this.t('itemRemoved', { locale }));
      } catch {
        return await interaction.editReply(this.t('itemRemoveError', { locale }));
      }
    }

    if (subcommand === 'item') {
      const item = options.getString('item', true);

      message.components.map(row => {
        if (row.components[0].type !== 'SELECT_MENU') return row;

        row.components = (<MessageSelectMenu[]>row.components).map(selectmenu => {
          if (selectmenu.customId !== menuId) return selectmenu;

          selectmenu.options = selectmenu.options.filter(option => option.value !== item);

          selectmenu.setMaxValues(selectmenu.options.length);

          return selectmenu;
        });

        return row;
      });

      try {
        await message.edit({ components: message.components });

        return await interaction.editReply(this.t('itemRemoved', { locale }));
      } catch {
        return await interaction.editReply(this.t('itemRemoveError', { locale }));
      }
    }
  }

  async editAutocomplete(interaction: AutocompleteInteraction, res: ApplicationCommandOptionChoice[] = []) {
    if (interaction.responded) return;

    const { client, guild, options } = <AutocompleteInteraction<'cached'>>interaction;

    const channelId = <string>options.get('channel', true).value;

    const channel = await guild.channels.fetch(channelId) as TextChannel;

    const focused = options.getFocused(true);
    const pattern = RegExp(`${focused.value}`, 'i');

    if (focused.name === 'message_id') {
      const messages = await channel.messages.fetch({ limit: 100 });

      const messages_array = messages.filter(m =>
        m.author.id === client.user?.id &&
        m.components.some(c => RegExp(`"c":"${this.data.name}"`).test(<string>c.components[0].customId)) &&
        pattern.test(m.id)).toJSON();

      for (let i = 0; i < messages_array.length; i++) {
        const { embeds, id } = messages_array[i];

        const [embed] = embeds;

        const { title, description } = embed;

        const nameProps = [
          id,
          title ? ` | ${title}` : '',
          description ? ` | ${description}` : '',
        ];

        if (title || description)
          res.push({
            name: `${nameProps.join('').match(this.pattern.label)?.[1]}`,
            value: `${id}`,
          });

        if (res.length === 25) break;
      }
    }

    if (focused.name === 'menu') {
      const message_id = <string>options.getString('message_id', true).match(this.pattern.messageURL)?.[1];

      const message = await channel.messages.fetch(message_id);

      if (!message) return await interaction.respond([]);

      if (!message.editable) return await interaction.respond([]);

      for (let i = 0; i < message.components.length; i++) {
        const component = message.components[i];

        if (component.components[0].type !== 'SELECT_MENU') continue;

        for (let i2 = 0; i2 < component.components.length; i2++) {
          const element = <MessageSelectMenu>component.components[i2];

          const { customId, disabled, maxValues, placeholder } = element;

          const menuProps = [
            `${i2 + 1}`,
            placeholder ? ` | ${placeholder}` : '',
            maxValues ? ` | ${maxValues} ${maxValues > 1 ? 'options' : 'option'}` : '',
            disabled ? ' | disabled' : '',
          ];

          const menuName = menuProps.join('');

          if (pattern.test(menuName))
            res.push({
              name: `${menuName.match(this.pattern.label)?.[1]}`,
              value: `${customId}`,
            });
        }
      }
    }

    if (focused.name === 'item') {
      const menuId = options.getString('menu', true);
      const message_id = <string>options.getString('message_id', true).match(this.pattern.messageURL)?.[1];

      const message = await channel.messages.fetch(message_id);

      if (!message) return await interaction.respond([]);

      if (!message.editable) return await interaction.respond([]);

      for (let i = 0; i < message.components.length; i++) {
        const component = message.components[i];

        if (component.components[0].type !== 'SELECT_MENU') continue;

        for (let i2 = 0; i2 < component.components.length; i2++) {
          const element = <MessageSelectMenu>component.components[i2];

          const { customId, options: menuOptions } = element;

          if (customId !== menuId || element.type !== 'SELECT_MENU') continue;

          for (let i3 = 0; i3 < menuOptions.length; i3++) {
            const option = menuOptions[i3];

            const { description, emoji, label, value } = option;

            const { roleId } = <SelectRolesItemOptionValue>JSON.parse(value);

            const role = await guild.roles.fetch(roleId);

            const nameProps = [
              emoji?.id ? '' : emoji?.name,
              label ? label : ` Item ${i2 + 1}`,
              ` | ${role?.name}`,
              ` | ${roleId}`,
              description ? ` | ${description}` : '',
            ];

            res.push({
              name: `${nameProps.join('').match(this.pattern.label)?.[1]}`,
              value,
            });
          }
        }
      }
    }

    await interaction.respond(res);
  }

  async addAutocomplete(interaction: AutocompleteInteraction) {
    return await this.editAutocomplete(interaction);
  }

  async removeAutocomplete(interaction: AutocompleteInteraction) {
    return await this.editAutocomplete(interaction);
  }
}