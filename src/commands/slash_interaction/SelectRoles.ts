import { SlashCommandBuilder } from '@discordjs/builders';
import { ApplicationCommandOptionChoiceData, AutocompleteInteraction, Client, CommandInteraction, EmojiIdentifierResolvable, MessageActionRow, MessageEmbed, MessageSelectMenu, TextChannel, Util } from 'discord.js';
import { SelectRolesItemOptionValue } from '../../@types';
import { SlashCommand } from '../../structures';

export default class SelectRoles extends SlashCommand {
  constructor(client: Client) {
    super(client, {
      category: 'Moderation',
      clientPermissions: ['EMBED_LINKS', 'MANAGE_ROLES', 'SEND_MESSAGES'],
      userPermissions: ['MANAGE_ROLES'],
    });

    this.data = new SlashCommandBuilder().setName('selectroles')
      .setDescription('Manage roles with a select menu.')
      .setNameLocalizations(this.getLocalizations('selectrolesName'))
      .setDescriptionLocalizations(this.getLocalizations('selectrolesDescription'))
      .addSubcommand(subcommand => subcommand.setName('setup')
        .setDescription('Create a select menu.')
        .setNameLocalizations(this.getLocalizations('selectrolesSetupName'))
        .setDescriptionLocalizations(this.getLocalizations('selectrolesSetupDescription'))
        .addRoleOption(option => option.setName('role')
          .setDescription('Select a role to add to the select menu.')
          .setNameLocalizations(this.getLocalizations('selectrolesSetupRoleName'))
          .setDescriptionLocalizations(this.getLocalizations('selectrolesSetupRoleDescription'))
          .setRequired(true))
        .addStringOption(option => option.setName('item_name')
          .setDescription('The name of the item. {0,83} - default: <role>')
          .setNameLocalizations(this.getLocalizations('selectrolesSetupItemNameName'))
          .setDescriptionLocalizations(this.getLocalizations('selectrolesSetupItemNameDescription')))
        .addStringOption(option => option.setName('item_description')
          .setDescription('The description of the item. {0,100}')
          .setNameLocalizations(this.getLocalizations('selectrolesSetupItemDescriptionName'))
          .setDescriptionLocalizations(this.getLocalizations('selectrolesSetupItemDescriptionDescription')))
        .addBooleanOption(option => option.setName('item_default')
          .setDescription('Used to always add this role with other roles.')
          .setNameLocalizations(this.getLocalizations('selectrolesSetupItemDefaultName'))
          .setDescriptionLocalizations(this.getLocalizations('selectrolesSetupItemDefaultDescription')))
        .addStringOption(option => option.setName('item_emoji')
          .setDescription('The emoji of the item.')
          .setNameLocalizations(this.getLocalizations('selectrolesSetupItemEmojiName'))
          .setDescriptionLocalizations(this.getLocalizations('selectrolesSetupItemEmojiDescription')))
        .addBooleanOption(option => option.setName('menu_disabled')
          .setDescription('Whether the setup is disabled.')
          .setNameLocalizations(this.getLocalizations('selectrolesSetupMenuDisabledName'))
          .setDescriptionLocalizations(this.getLocalizations('selectrolesSetupMenuDisabledDescription')))
        .addStringOption(option => option.setName('menu_place_holder')
          .setDescription('The placeholder of the menu. {0,150}')
          .setNameLocalizations(this.getLocalizations('selectrolesSetupMenuPlaceHolderName'))
          .setDescriptionLocalizations(this.getLocalizations('selectrolesSetupMenuPlaceHolderDescription')))
        .addStringOption(option => option.setName('text')
          .setDescription('The channel of the setup. Title {0,256} | Description {0,4096} - default: SelectRoles')
          .setNameLocalizations(this.getLocalizations('selectrolesSetupTextName'))
          .setDescriptionLocalizations(this.getLocalizations('selectrolesSetupTextDescription')))
        .addChannelOption(option => option.setName('channel')
          .setDescription('The channel of the setup. default: <current channel>')
          .setNameLocalizations(this.getLocalizations('selectrolesSetupChannelName'))
          .setDescriptionLocalizations(this.getLocalizations('selectrolesSetupChannelDescription'))
          .addChannelTypes(...this.GuildTextChannelTypes)))
      .addSubcommandGroup(subcommandgroup => subcommandgroup.setName('edit')
        .setDescription('Edit the Select roles.')
        .setNameLocalizations(this.getLocalizations('selectrolesEditName'))
        .setDescriptionLocalizations(this.getLocalizations('selectrolesEditDescription'))
        .addSubcommand(subcommand => subcommand.setName('message')
          .setDescription('Edit a text in a Select role.')
          .setNameLocalizations(this.getLocalizations('selectrolesEditMessageName'))
          .setDescriptionLocalizations(this.getLocalizations('selectrolesEditMessageDescription'))
          .addChannelOption(option => option.setName('channel')
            .setDescription('Select the channel of the message.')
            .setNameLocalizations(this.getLocalizations('selectrolesEditMessageChannelName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesEditMessageChannelDescription'))
            .setRequired(true)
            .addChannelTypes(...this.GuildTextChannelTypes))
          .addStringOption(option => option.setName('message_id')
            .setDescription('Message ID | Message URL')
            .setNameLocalizations(this.getLocalizations('selectrolesEditMessageMessageIdName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesEditMessageMessageIdDescription'))
            .setAutocomplete(true)
            .setRequired(true))
          .addStringOption(option => option.setName('text')
            .setDescription('The text of the message. Title {0,256} | Description {0,4096}')
            .setNameLocalizations(this.getLocalizations('selectrolesEditMessageTextName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesEditMessageTextDescription'))
            .setRequired(true)))
        .addSubcommand(subcommand => subcommand.setName('menu')
          .setDescription('Edit a select menu.Edit the menu of the Select roles.')
          .setNameLocalizations(this.getLocalizations('selectrolesEditMenuName'))
          .setDescriptionLocalizations(this.getLocalizations('selectrolesEditMenuDescription'))
          .addChannelOption(option => option.setName('channel')
            .setDescription('Select the channel of the menu.')
            .setNameLocalizations(this.getLocalizations('selectrolesEditMenuChannelName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesEditMenuChannelDescription'))
            .setRequired(true)
            .addChannelTypes(...this.GuildTextChannelTypes))
          .addStringOption(option => option.setName('message_id')
            .setDescription('Message ID | Message URL')
            .setNameLocalizations(this.getLocalizations('selectrolesEditMenuMessageIdName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesEditMenuMessageIdDescription'))
            .setAutocomplete(true)
            .setRequired(true))
          .addStringOption(option => option.setName('menu')
            .setDescription('Select the menu.')
            .setNameLocalizations(this.getLocalizations('selectrolesEditMenuMenuName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesEditMenuMenuDescription'))
            .setAutocomplete(true)
            .setRequired(true))
          .addBooleanOption(option => option.setName('menu_disabled')
            .setDescription('Whether the menu is disabled.')
            .setNameLocalizations(this.getLocalizations('selectrolesEditMenuMenuDisabledName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesEditMenuMenuDisabledDescription')))
          .addStringOption(option => option.setName('menu_place_holder')
            .setDescription('The place holder of the menu. {0,150}')
            .setNameLocalizations(this.getLocalizations('selectrolesEditMenuMenuPlaceHolderName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesEditMenuMenuPlaceHolderDescription'))))
        .addSubcommand(subcommand => subcommand.setName('item')
          .setDescription('Edit the item of the Select roles.')
          .setNameLocalizations(this.getLocalizations('selectrolesEditItemName'))
          .setDescriptionLocalizations(this.getLocalizations('selectrolesEditItemDescription'))
          .addChannelOption(option => option.setName('channel')
            .setDescription('Select the channel of the item.')
            .setNameLocalizations(this.getLocalizations('selectrolesEditItemChannelName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesEditItemChannelDescription'))
            .setRequired(true)
            .addChannelTypes(...this.GuildTextChannelTypes))
          .addStringOption(option => option.setName('message_id')
            .setDescription('Message ID | Message URL')
            .setNameLocalizations(this.getLocalizations('selectrolesEditItemMessageIdName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesEditItemMessageIdDescription'))
            .setAutocomplete(true)
            .setRequired(true))
          .addStringOption(option => option.setName('menu')
            .setDescription('Select the menu of the item.')
            .setNameLocalizations(this.getLocalizations('selectrolesEditItemMenuName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesEditItemMenuDescription'))
            .setAutocomplete(true)
            .setRequired(true))
          .addStringOption(option => option.setName('item')
            .setDescription('Select the item.')
            .setNameLocalizations(this.getLocalizations('selectrolesEditItemItemName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesEditItemItemDescription'))
            .setAutocomplete(true)
            .setRequired(true))
          .addRoleOption(option => option.setName('role')
            .setDescription('Select a new role.')
            .setNameLocalizations(this.getLocalizations('selectrolesEditItemRoleName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesEditItemRoleDescription')))
          .addStringOption(option => option.setName('item_name')
            .setDescription('Input a new name for the item. {0,83}')
            .setNameLocalizations(this.getLocalizations('selectrolesEditItemItemNameName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesEditItemItemNameDescription')))
          .addStringOption(option => option.setName('item_description')
            .setDescription('Input a new description for the item. {0,100}')
            .setNameLocalizations(this.getLocalizations('selectrolesEditItemItemDescriptionName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesEditItemItemDescriptionDescription')))
          .addBooleanOption(option => option.setName('item_default')
            .setDescription('Used to always add this role with other roles.')
            .setNameLocalizations(this.getLocalizations('selectrolesEditItemItemDefaultName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesEditItemItemDefaultDescription')))
          .addStringOption(option => option.setName('item_emoji')
            .setDescription('Input a new emoji for the item.')
            .setNameLocalizations(this.getLocalizations('selectrolesEditItemItemEmojiName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesEditItemItemEmojiDescription')))))
      .addSubcommandGroup(subcommandgroup => subcommandgroup.setName('add')
        .setDescription('Add to the Select roles.')
        .setNameLocalizations(this.getLocalizations('selectrolesAddName'))
        .setDescriptionLocalizations(this.getLocalizations('selectrolesAddDescription'))
        .addSubcommand(subcommand => subcommand.setName('menu')
          .setDescription('Add a menu to the Select roles.')
          .setNameLocalizations(this.getLocalizations('selectrolesAddMenuName'))
          .setDescriptionLocalizations(this.getLocalizations('selectrolesAddMenuDescription'))
          .addChannelOption(option => option.setName('channel')
            .setDescription('Select the channel of the menu.')
            .setNameLocalizations(this.getLocalizations('selectrolesAddMenuChannelName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesAddMenuChannelDescription'))
            .setRequired(true)
            .addChannelTypes(...this.GuildTextChannelTypes))
          .addStringOption(option => option.setName('message_id')
            .setDescription('Message ID | Message URL')
            .setNameLocalizations(this.getLocalizations('selectrolesAddMenuMessageIdName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesAddMenuMessageIdDescription'))
            .setAutocomplete(true)
            .setRequired(true))
          .addRoleOption(option => option.setName('role')
            .setDescription('Select a role to add to the menu.')
            .setNameLocalizations(this.getLocalizations('selectrolesAddMenuRoleName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesAddMenuRoleDescription'))
            .setRequired(true))
          .addStringOption(option => option.setName('item_name')
            .setDescription('The name of the item. {0,83} - default: <role>')
            .setNameLocalizations(this.getLocalizations('selectrolesAddMenuItemNameName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesAddMenuItemNameDescription')))
          .addStringOption(option => option.setName('item_description')
            .setDescription('The description of the item. {0,100}')
            .setNameLocalizations(this.getLocalizations('selectrolesAddMenuItemDescriptionName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesAddMenuItemDescriptionDescription')))
          .addBooleanOption(option => option.setName('item_default')
            .setDescription('Used to always add this role with other roles.')
            .setNameLocalizations(this.getLocalizations('selectrolesAddMenuItemDefaultName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesAddMenuItemDefaultDescription')))
          .addStringOption(option => option.setName('item_emoji')
            .setDescription('The emoji of the item.')
            .setNameLocalizations(this.getLocalizations('selectrolesAddMenuItemEmojiName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesAddMenuItemEmojiDescription')))
          .addBooleanOption(option => option.setName('menu_disabled')
            .setDescription('Whether the menu is disabled.')
            .setNameLocalizations(this.getLocalizations('selectrolesAddMenuMenuDisabledName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesAddMenuMenuDisabledDescription')))
          .addStringOption(option => option.setName('menu_place_holder')
            .setDescription('The place holder of the menu. {0,150}')
            .setNameLocalizations(this.getLocalizations('selectrolesAddMenuMenuPlaceHolderName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesAddMenuMenuPlaceHolderDescription'))))
        .addSubcommand(subcommand => subcommand.setName('item')
          .setDescription('Add an item to the Select roles.')
          .setNameLocalizations(this.getLocalizations('selectrolesAddItemName'))
          .setDescriptionLocalizations(this.getLocalizations('selectrolesAddItemDescription'))
          .addChannelOption(option => option.setName('channel')
            .setDescription('Select the channel of the item.')
            .setNameLocalizations(this.getLocalizations('selectrolesAddItemChannelName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesAddItemChannelDescription'))
            .setRequired(true)
            .addChannelTypes(...this.GuildTextChannelTypes))
          .addStringOption(option => option.setName('message_id')
            .setDescription('Message ID | Message URL')
            .setNameLocalizations(this.getLocalizations('selectrolesAddItemMessageIdName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesAddItemMessageIdDescription'))
            .setAutocomplete(true)
            .setRequired(true))
          .addStringOption(option => option.setName('menu')
            .setDescription('Select the menu of the item.')
            .setNameLocalizations(this.getLocalizations('selectrolesAddItemMenuName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesAddItemMenuDescription'))
            .setAutocomplete(true)
            .setRequired(true))
          .addRoleOption(option => option.setName('role')
            .setDescription('Select a role to add to the item.')
            .setNameLocalizations(this.getLocalizations('selectrolesAddItemRoleName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesAddItemRoleDescription'))
            .setRequired(true))
          .addStringOption(option => option.setName('item_name')
            .setDescription('The name of the item. {0,83} - default: <role>')
            .setNameLocalizations(this.getLocalizations('selectrolesAddItemItemNameName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesAddItemItemNameDescription')))
          .addStringOption(option => option.setName('item_description')
            .setDescription('The description of the item. {0,100}')
            .setNameLocalizations(this.getLocalizations('selectrolesAddItemItemDescriptionName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesAddItemItemDescriptionDescription')))
          .addBooleanOption(option => option.setName('item_default')
            .setDescription('Used to always add this role with other roles.')
            .setNameLocalizations(this.getLocalizations('selectrolesAddItemItemDefaultName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesAddItemItemDefaultDescription')))
          .addStringOption(option => option.setName('item_emoji')
            .setDescription('The emoji of the item.')
            .setNameLocalizations(this.getLocalizations('selectrolesAddItemItemEmojiName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesAddItemItemEmojiDescription')))))
      .addSubcommandGroup(subcommandgroup => subcommandgroup.setName('remove')
        .setDescription('Remove from the Select roles.')
        .setNameLocalizations(this.getLocalizations('selectrolesRemoveName'))
        .setDescriptionLocalizations(this.getLocalizations('selectrolesRemoveDescription'))
        .addSubcommand(subcommand => subcommand.setName('menu')
          .setDescription('Remove a menu from the Select roles.')
          .setNameLocalizations(this.getLocalizations('selectrolesRemoveMenuName'))
          .setDescriptionLocalizations(this.getLocalizations('selectrolesRemoveMenuDescription'))
          .addChannelOption(option => option.setName('channel')
            .setDescription('Select the channel of the menu.')
            .setNameLocalizations(this.getLocalizations('selectrolesRemoveMenuChannelName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesRemoveMenuChannelDescription'))
            .setRequired(true)
            .addChannelTypes(...this.GuildTextChannelTypes))
          .addStringOption(option => option.setName('message_id')
            .setDescription('Message ID | Message URL')
            .setNameLocalizations(this.getLocalizations('selectrolesRemoveMenuMessageIdName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesRemoveMenuMessageIdDescription'))
            .setAutocomplete(true)
            .setRequired(true))
          .addStringOption(option => option.setName('menu')
            .setDescription('Select the menu to remove.')
            .setNameLocalizations(this.getLocalizations('selectrolesRemoveMenuMenuName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesRemoveMenuMenuDescription'))
            .setAutocomplete(true)
            .setRequired(true)))
        .addSubcommand(subcommand => subcommand.setName('item')
          .setDescription('Remove an item from the Select roles.')
          .setNameLocalizations(this.getLocalizations('selectrolesRemoveItemName'))
          .setDescriptionLocalizations(this.getLocalizations('selectrolesRemoveItemDescription'))
          .addChannelOption(option => option.setName('channel')
            .setDescription('Select the channel of the item.')
            .setNameLocalizations(this.getLocalizations('selectrolesRemoveItemChannelName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesRemoveItemChannelDescription'))
            .setRequired(true)
            .addChannelTypes(...this.GuildTextChannelTypes))
          .addStringOption(option => option.setName('message_id')
            .setDescription('Message ID | Message URL')
            .setNameLocalizations(this.getLocalizations('selectrolesRemoveItemMessageIdName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesRemoveItemMessageIdDescription'))
            .setAutocomplete(true)
            .setRequired(true))
          .addStringOption(option => option.setName('menu')
            .setDescription('Select the menu of the item.')
            .setNameLocalizations(this.getLocalizations('selectrolesRemoveItemMenuName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesRemoveItemMenuDescription'))
            .setAutocomplete(true)
            .setRequired(true))
          .addStringOption(option => option.setName('item')
            .setDescription('Select the item to remove.')
            .setNameLocalizations(this.getLocalizations('selectrolesRemoveItemItemName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesRemoveItemItemDescription'))
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

    const userPerms = memberPermissions.missing(this.props!.userPermissions!);

    if (userPerms.length) {
      if (interaction.isAutocomplete()) return await interaction.respond([]);

      return await interaction.reply({
        content: this.t('missingUserPermission', { locale, permission: userPerms[0] }),
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
    const item_default = options.getBoolean('item_default') ?? false;
    const description = options.getString('item_description')?.slice(0, 100);
    const emoji = <EmojiIdentifierResolvable>options.getString('item_emoji');
    const menu_disabled = <boolean>options.getBoolean('menu_disabled');
    const menu_place_holder = options.getString('menu_place_holder')?.slice(0, 150) || '';
    const role = options.getRole('role', true);
    const label = (options.getString('item_name') ?? role.name).slice(0, 83);

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
        emoji,
        default: item_default,
      }])
      .setPlaceholder(menu_place_holder);

    const components = [new MessageActionRow().setComponents(selectMenu)];

    const embeds = [
      new MessageEmbed()
        .setColor('RANDOM')
        .setDescription(embed_description ? embed_description.replace(/(\s{2})/g, '\n') : '')
        .setTitle(title ? title : embed_description ? '' : 'SelectRoles'),
    ];

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

      const embeds = [
        new MessageEmbed()
          .setColor('RANDOM')
          .setDescription(description ? description.replace(/(\s{2})/g, '\n') : '')
          .setTitle(title || ''),
      ];

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
      const menu_place_holder = options.getString('menu_place_holder')?.slice(0, 150);

      message.components.map(row => {
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
        await message.edit({ components: message.components });

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

      const description = options.getString('item_description')?.slice(0, 100);
      const item_default = options.getBoolean('item_default');
      const emoji = options.getString('item_emoji');
      const label = options.getString('item_name')?.slice(0, 83);

      message.components.map(row => {
        if (row.components[0].type !== 'SELECT_MENU') return row;

        row.components.map(selectmenu => {
          if (selectmenu.customId !== menuId || selectmenu.type !== 'SELECT_MENU') return selectmenu;

          selectmenu.options.map(option => {
            if (option.value !== item) return option;

            const { count, d } = <SelectRolesItemOptionValue>JSON.parse(option.value);

            option.default = typeof item_default === 'boolean' ? item_default : option.default;
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
        await message.edit({ components: message.components });

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

    const item_default = options.getBoolean('item_default') ?? false;
    const description = options.getString('item_description')?.slice(0, 100);
    const emoji = <EmojiIdentifierResolvable>options.getString('item_emoji');
    const label = (options.getString('item_name') ?? role.name).slice(0, 83);

    const subcommand = options.getSubcommand();

    if (subcommand === 'menu') {
      const menu_disabled = <boolean>options.getBoolean('menu_disabled');
      const menu_place_holder = options.getString('menu_place_holder')?.slice(0, 150) || '';

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
          emoji,
          default: item_default,
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
            emoji,
            default: item_default,
          }])
            .setMaxValues(selectmenu.options.length)
            .options.sort((a) => a.default ? -1 : 1);

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

        row.components.map(selectmenu => {
          if (selectmenu.customId !== menuId || selectmenu.type !== 'SELECT_MENU') return selectmenu;

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

  async editAutocomplete(interaction: AutocompleteInteraction, res: ApplicationCommandOptionChoiceData[] = []) {
    if (interaction.responded) return;

    const { client, guild, options } = <AutocompleteInteraction<'cached'>>interaction;

    const channelId = <string>options.get('channel', true).value;

    const channel = await guild.channels.fetch(channelId);

    if (!(channel instanceof TextChannel))
      return await interaction.respond(res);

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
            name: `${nameProps.join('').slice(0, 100)}`,
            value: `${id}`,
          });

        if (res.length === 25) break;
      }
    }

    if (focused.name === 'menu') {
      const message_id = <string>options.getString('message_id', true).match(this.pattern.messageURL)?.[1];

      const message = await channel.messages.fetch(message_id);

      if (!message) return await interaction.respond(res);

      if (!message.editable) return await interaction.respond(res);

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
              name: `${menuName.slice(0, 100)}`,
              value: `${customId}`,
            });
        }
      }
    }

    if (focused.name === 'item') {
      const menuId = options.getString('menu', true);
      const message_id = <string>options.getString('message_id', true).match(this.pattern.messageURL)?.[1];

      const message = await channel.messages.fetch(message_id);

      if (!message) return await interaction.respond(res);

      if (!message.editable) return await interaction.respond(res);

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
              name: `${nameProps.join('').slice(0, 100)}`,
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