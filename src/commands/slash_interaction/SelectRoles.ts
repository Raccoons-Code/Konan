import { ActionRowBuilder, APISelectMenuComponent, ApplicationCommandOptionChoiceData, AutocompleteInteraction, ChatInputCommandInteraction, Client, ComponentEmojiResolvable, ComponentType, EmbedBuilder, InteractionType, parseEmoji, PermissionFlagsBits, Role, SelectMenuBuilder, SelectMenuComponent, SelectMenuOptionBuilder, SlashCommandBuilder, TextChannel } from 'discord.js';
import { SelectRolesItemOptionValue } from '../../@types';
import { SlashCommand } from '../../structures';

const { SelectMenu } = ComponentType;
const { ApplicationCommandAutocomplete } = InteractionType;

export default class SelectRoles extends SlashCommand {
  [k: string]: any;

  constructor(client: Client) {
    super(client, {
      category: 'Moderation',
      clientPermissions: ['EmbedLinks', 'ManageRoles', 'SendMessages'],
      userPermissions: ['ManageRoles'],
    });

    this.data = new SlashCommandBuilder().setName('selectroles')
      .setDescription('Manage roles with a select menu.')
      .setDMPermission(false)
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
      .setNameLocalizations(this.getLocalizations('selectrolesName'))
      .setDescriptionLocalizations(this.getLocalizations('selectrolesDescription'))
      .addSubcommand(subcommand => subcommand.setName('create')
        .setDescription('Create a select menu.')
        .setNameLocalizations(this.getLocalizations('selectrolesCreateName'))
        .setDescriptionLocalizations(this.getLocalizations('selectrolesCreateDescription'))
        .addRoleOption(option => option.setName('role')
          .setDescription('Select a role to add to the select menu.')
          .setNameLocalizations(this.getLocalizations('selectrolesCreateRoleName'))
          .setDescriptionLocalizations(this.getLocalizations('selectrolesCreateRoleDescription'))
          .setRequired(true))
        .addStringOption(option => option.setName('item_name')
          .setDescription('The name of the item. {0,83} - default: <role>')
          .setNameLocalizations(this.getLocalizations('selectrolesCreateItemNameName'))
          .setDescriptionLocalizations(this.getLocalizations('selectrolesCreateItemNameDescription')))
        .addStringOption(option => option.setName('item_description')
          .setDescription('The description of the item. {0,100}')
          .setNameLocalizations(this.getLocalizations('selectrolesCreateItemDescriptionName'))
          .setDescriptionLocalizations(this.getLocalizations('selectrolesCreateItemDescriptionDescription')))
        .addBooleanOption(option => option.setName('item_default')
          .setDescription('Used to always add this role with other roles.')
          .setNameLocalizations(this.getLocalizations('selectrolesCreateItemDefaultName'))
          .setDescriptionLocalizations(this.getLocalizations('selectrolesCreateItemDefaultDescription')))
        .addStringOption(option => option.setName('item_emoji')
          .setDescription('The emoji of the item.')
          .setNameLocalizations(this.getLocalizations('selectrolesCreateItemEmojiName'))
          .setDescriptionLocalizations(this.getLocalizations('selectrolesCreateItemEmojiDescription')))
        .addBooleanOption(option => option.setName('menu_disabled')
          .setDescription('Whether the menu is disabled.')
          .setNameLocalizations(this.getLocalizations('selectrolesCreateMenuDisabledName'))
          .setDescriptionLocalizations(this.getLocalizations('selectrolesCreateMenuDisabledDescription')))
        .addStringOption(option => option.setName('menu_place_holder')
          .setDescription('The placeholder of the menu. {0,150}')
          .setNameLocalizations(this.getLocalizations('selectrolesCreateMenuPlaceHolderName'))
          .setDescriptionLocalizations(this.getLocalizations('selectrolesCreateMenuPlaceHolderDescription')))
        .addStringOption(option => option.setName('text')
          .setDescription('The text of the message. Title {0,256} | Description {0,4096} - default: SelectRoles')
          .setNameLocalizations(this.getLocalizations('selectrolesCreateTextName'))
          .setDescriptionLocalizations(this.getLocalizations('selectrolesCreateTextDescription')))
        .addChannelOption(option => option.setName('channel')
          .setDescription('The channel of the setup. default: <current channel>')
          .setNameLocalizations(this.getLocalizations('selectrolesCreateChannelName'))
          .setDescriptionLocalizations(this.getLocalizations('selectrolesCreateChannelDescription'))
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
            .setRequired(true))))
      .addSubcommandGroup(subcommandgroup => subcommandgroup.setName('bulk')
        .setDescription('Bulk manage Select roles.')
        .setNameLocalizations(this.getLocalizations('selectrolesBulkName'))
        .setDescriptionLocalizations(this.getLocalizations('selectrolesBulkDescription'))
        .addSubcommand(subcommand => subcommand.setName('create')
          .setDescription('Create a bulk of options in a Select role.')
          .setNameLocalizations(this.getLocalizations('selectrolesBulkCreateName'))
          .setDescriptionLocalizations(this.getLocalizations('selectrolesBulkCreateDescription'))
          .addStringOption(option => option.setName('roles')
            .setDescription('Input the roles.')
            .setNameLocalizations(this.getLocalizations('selectrolesBulkCreateRolesName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesBulkCreateRolesDescription'))
            .setRequired(true))
          .addStringOption(option => option.setName('text')
            .setDescription('The Select Role text. Title {0,256} | Description {0,4096} - default: SelectRoles')
            .setNameLocalizations(this.getLocalizations('selectrolesBulkCreateTextName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesBulkCreateTextDescription')))
          .addChannelOption(option => option.setName('channel')
            .setDescription('Select the channel. default: <current channel>')
            .setNameLocalizations(this.getLocalizations('selectrolesBulkCreateChannelName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesBulkCreateChannelDescription'))
            .addChannelTypes(...this.GuildTextChannelTypes))
          .addRoleOption(option => option.setName('default_role')
            .setDescription('Select the default role.')
            .setNameLocalizations(this.getLocalizations('selectrolesBulkCreateDefaultRoleName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesBulkCreateDefaultRoleDescription')))
          .addStringOption(option => option.setName('menu_place_holder')
            .setDescription('The menu place holder. {0,150}')
            .setDescriptionLocalizations(this.getLocalizations('selectrolesBulkCreateMenuPlaceHolderDescription'))
            .setNameLocalizations(this.getLocalizations('selectrolesBulkCreateMenuPlaceHolderName'))))
        .addSubcommand(subcommand => subcommand.setName('add')
          .setDescription('Add to a bulk of options in a Select role.')
          .setNameLocalizations(this.getLocalizations('selectrolesBulkAddName'))
          .setDescriptionLocalizations(this.getLocalizations('selectrolesBulkAddDescription'))
          .addChannelOption(option => option.setName('channel')
            .setDescription('Select the channel.')
            .setNameLocalizations(this.getLocalizations('selectrolesBulkAddChannelName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesBulkAddChannelDescription'))
            .addChannelTypes(...this.GuildTextChannelTypes)
            .setRequired(true))
          .addStringOption(option => option.setName('message_id')
            .setDescription('Message ID | Message URL')
            .setNameLocalizations(this.getLocalizations('selectrolesBulkAddMessageIdName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesBulkAddMessageIdDescription'))
            .setAutocomplete(true)
            .setRequired(true))
          .addStringOption(option => option.setName('roles')
            .setDescription('Input the roles.')
            .setNameLocalizations(this.getLocalizations('selectrolesBulkAddRolesName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesBulkAddRolesDescription'))
            .setRequired(true))
          .addRoleOption(option => option.setName('default_role')
            .setDescription('Select the default role.')
            .setNameLocalizations(this.getLocalizations('selectrolesBulkAddDefaultRoleName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesBulkAddDefaultRoleDescription')))
          .addStringOption(option => option.setName('menu_place_holder')
            .setDescription('The menu place holder. {0,150}')
            .setNameLocalizations(this.getLocalizations('selectrolesBulkAddMenuPlaceHolderName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesBulkAddMenuPlaceHolderDescription'))))
        .addSubcommand(subcommand => subcommand.setName('remove')
          .setDescription('Remove from a bulk of options in a Select role.')
          .setNameLocalizations(this.getLocalizations('selectrolesBulkRemoveName'))
          .setDescriptionLocalizations(this.getLocalizations('selectrolesBulkRemoveDescription'))
          .addChannelOption(option => option.setName('channel')
            .setDescription('Select the channel.')
            .setNameLocalizations(this.getLocalizations('selectrolesBulkRemoveChannelName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesBulkRemoveChannelDescription'))
            .addChannelTypes(...this.GuildTextChannelTypes)
            .setRequired(true))
          .addStringOption(option => option.setName('message_id')
            .setDescription('Message ID | Message URL')
            .setNameLocalizations(this.getLocalizations('selectrolesBulkRemoveMessageIdName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesBulkRemoveMessageIdDescription'))
            .setAutocomplete(true)
            .setRequired(true))
          .addStringOption(option => option.setName('roles')
            .setDescription('Input the roles.')
            .setNameLocalizations(this.getLocalizations('selectrolesBulkRemoveRolesName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesBulkRemoveRolesDescription'))
            .setRequired(true))));
  }

  async execute(interaction: ChatInputCommandInteraction | AutocompleteInteraction): Promise<any> {
    const { locale } = interaction;

    if (!interaction.inCachedGuild()) {
      if (interaction.type === ApplicationCommandAutocomplete) return interaction.respond([]);

      return interaction.editReply(this.t('onlyOnServer', { locale }));
    }

    const { memberPermissions, options } = interaction;

    const userPerms = memberPermissions.missing(this.props!.userPermissions!);

    if (userPerms.length) {
      if (interaction.type === ApplicationCommandAutocomplete) return interaction.respond([]);

      return interaction.reply({
        content: this.t('missingUserPermission', {
          locale,
          permission: this.t(userPerms[0], { locale }),
        }),
        ephemeral: true,
      });
    }

    const subcommand = options.getSubcommandGroup() ?? options.getSubcommand();

    if (interaction.type === ApplicationCommandAutocomplete)
      return this[`${subcommand}Autocomplete`]?.(interaction);

    await interaction.deferReply({ ephemeral: true });

    return this[subcommand]?.(interaction);
  }

  async create(interaction: ChatInputCommandInteraction): Promise<any> {
    const { locale, options } = interaction;

    const [, title, embed_description] = options.getString('text')?.match(this.pattern.embed) ?? [];
    const channel = <TextChannel>options.getChannel('channel') ?? interaction.channel;
    const item_default = options.getBoolean('item_default') ?? false;
    const description = options.getString('item_description')?.slice(0, 100) ?? '';
    const item_emoji = options.getString('item_emoji');
    const menu_disabled = Boolean(options.getBoolean('menu_disabled'));
    const menu_place_holder = options.getString('menu_place_holder')?.slice(0, 150) ?? '';
    const role = options.getRole('role', true);
    const label = (options.getString('item_name') ?? role.name).slice(0, 83);

    const emoji = item_emoji ? <ComponentEmojiResolvable>parseEmoji(item_emoji) : {};

    const components = [
      new ActionRowBuilder<SelectMenuBuilder>()
        .setComponents(new SelectMenuBuilder()
          .setCustomId(JSON.stringify({
            c: this.data.name,
            count: 0,
            d: Date.now(),
          }))
          .setDisabled(menu_disabled)
          .setMaxValues(1)
          .setOptions(new SelectMenuOptionBuilder()
            .setDefault(item_default)
            .setDescription(description)
            .setEmoji(emoji)
            .setLabel(label)
            .setValue(JSON.stringify({
              count: 0,
              roleId: role.id,
            })))
          .setPlaceholder(menu_place_holder)),
    ];

    const embeds = [
      new EmbedBuilder()
        .setColor('Random')
        .setDescription(embed_description?.replace(/(\s{2})/g, '\n') || null)
        .setTitle(title ? title : embed_description ? null : 'SelectRoles'),
    ];

    try {
      await channel.send({ components, embeds });

      return interaction.editReply(this.t('?created', { locale, string: 'Select Role' }));
    } catch {
      return interaction.editReply(this.t('createError', { locale, string: 'Select Role' }));
    }
  }

  async edit(interaction: ChatInputCommandInteraction): Promise<any> {
    const { locale, options } = interaction;

    const channel = <TextChannel>options.getChannel('channel', true);
    const message_id = <string>options.getString('message_id', true).match(this.pattern.messageURL)?.[1];

    const message = await channel.messages.fetch(message_id);

    if (!message) return interaction.editReply(this.t('message404', { locale }));
    if (!message.editable) return interaction.editReply(this.t('messageNotEditable', { locale }));

    const subcommand = options.getSubcommand();

    if (subcommand === 'message') {
      const [, title, description] = options.getString('text', true).match(this.pattern.embed) ?? [];

      const embeds = [
        new EmbedBuilder()
          .setColor('Random')
          .setDescription(description?.replace(/(\s{2})/g, '\n') || null)
          .setTitle(title || null),
      ];

      try {
        await message.edit({ embeds });

        return interaction.editReply(this.t('?edited', { locale, string: 'Select Role' }));
      } catch {
        return interaction.editReply(this.t('editError', { locale, string: 'Select Role' }));
      }
    }

    const menuId = options.getString('menu', true);

    if (subcommand === 'menu') {
      const menu_disabled = options.getBoolean('menu_disabled');
      const menu_place_holder = options.getString('menu_place_holder')?.slice(0, 150) ?? '';

      const components = message.components.map(row => {
        if (row.components[0].type !== SelectMenu) return row;

        return new ActionRowBuilder<SelectMenuBuilder>(row.toJSON())
          .setComponents(row.components.map(element => {
            const newSelectMenu = new SelectMenuBuilder(<APISelectMenuComponent>element.toJSON());

            if (element.customId !== menuId) return newSelectMenu;

            const { disabled, placeholder } = newSelectMenu.data;

            return newSelectMenu.setDisabled(typeof menu_disabled === 'boolean' ? menu_disabled : disabled)
              .setPlaceholder(menu_place_holder ?? placeholder);
          }));
      });

      try {
        await message.edit({ components });

        return interaction.editReply(this.t('?edited', { locale, string: 'Select Role' }));
      } catch {
        return interaction.editReply(this.t('editError', { locale, string: 'Select Role' }));
      }
    }

    const item = options.getString('item', true);

    if (subcommand === 'item') {
      const role = options.getRole('role');

      if (role ? this.Util.componentsHasRoles(message.components, [role]) : false)
        return interaction.editReply(this.t('itemAddError', { locale }));

      const description = options.getString('item_description')?.slice(0, 100);
      const item_default = options.getBoolean('item_default');
      const item_emoji = options.getString('item_emoji');
      const label = options.getString('item_name')?.slice(0, 83);

      const emoji = item_emoji ? <ComponentEmojiResolvable>parseEmoji(item_emoji) : null;

      const components = message.components.map(row => {
        if (row.components[0].type !== SelectMenu) return row;
        if (row.components.every(element => element.customId !== menuId)) return row;

        return new ActionRowBuilder<SelectMenuBuilder>(row.toJSON())
          .setComponents(row.components.map(element => {
            const newSelectMenu = new SelectMenuBuilder(<APISelectMenuComponent>element.toJSON());

            if (element.customId !== menuId)
              return newSelectMenu.setOptions(newSelectMenu.data.options!.map(option =>
                new SelectMenuOptionBuilder(option)
                  .setDefault(Boolean(typeof item_default === 'boolean' ? false : option.default))));

            newSelectMenu.setOptions(newSelectMenu.data.options!.map(option => {
              if (option.value !== item) {
                if (typeof item_default === 'boolean')
                  option.default = false;

                return option;
              }

              const { count, d } = <SelectRolesItemOptionValue>JSON.parse(option.value);

              return new SelectMenuOptionBuilder(option)
                .setDefault(Boolean(typeof item_default === 'boolean' ? item_default : option.default))
                .setDescription(description ? description : option.description ?? '')
                .setEmoji(emoji ?? option.emoji ?? {})
                .setLabel(label ? `${label} ${count}` : option.label)
                .setValue(role ? JSON.stringify({ count, d: d, roleId: role.id }) : option.value);
            }));

            return newSelectMenu;
          }));
      });

      try {
        await message.edit({ components });

        return interaction.editReply(this.t('?edited', { locale, string: 'Select Role' }));
      } catch {
        return interaction.editReply(this.t('editError', { locale, string: 'Select Role' }));
      }
    }
  }

  async add(interaction: ChatInputCommandInteraction): Promise<any> {
    const { locale, options } = interaction;

    const channel = <TextChannel>options.getChannel('channel', true);
    const message_id = <string>options.getString('message_id', true).match(this.pattern.messageURL)?.[1];

    const message = await channel.messages.fetch(message_id);

    if (!message) return interaction.editReply(this.t('message404', { locale }));
    if (!message.editable) return interaction.editReply(this.t('messageNotEditable', { locale }));

    const role = options.getRole('role', true);

    if (this.Util.componentsHasRoles(message.components, [role]))
      return interaction.editReply(this.t('itemAddError', { locale }));

    const item_default = options.getBoolean('item_default');
    const description = options.getString('item_description')?.slice(0, 100) ?? '';
    const emoji = <ComponentEmojiResolvable>options.getString('item_emoji');
    const label = (options.getString('item_name') ?? role.name).slice(0, 83);

    const components = [];

    if (typeof item_default === 'boolean')
      components.push(...message.components.map(row => {
        if (row.components[0].type !== SelectMenu) return row;

        return new ActionRowBuilder<SelectMenuBuilder>(row.toJSON())
          .setComponents(row.components.map(element => {
            const newSelectMenu = new SelectMenuBuilder(<APISelectMenuComponent>element.toJSON());

            if (element.type !== SelectMenu) return newSelectMenu;

            return newSelectMenu
              .setOptions(element.options.map(option => new SelectMenuOptionBuilder(option)
                .setDefault(false)));
          }));
      }));

    const subcommand = options.getSubcommand();

    if (subcommand === 'menu') {
      const menu_disabled = options.getBoolean('menu_disabled')!;
      const menu_place_holder = options.getString('menu_place_holder')?.slice(0, 150) ?? '';

      components.push(...message.components,
        new ActionRowBuilder<SelectMenuBuilder>()
          .setComponents(new SelectMenuBuilder()
            .setCustomId(JSON.stringify({
              c: this.data.name,
              count: 0,
              d: Date.now(),
            }))
            .setDisabled(menu_disabled)
            .setMaxValues(1)
            .setOptions(new SelectMenuOptionBuilder()
              .setDefault(Boolean(item_default))
              .setDescription(description)
              .setEmoji(emoji)
              .setLabel(`${label} 0`)
              .setValue(JSON.stringify({
                count: 0,
                roleId: role.id,
              })))
            .setPlaceholder(menu_place_holder)));

      try {
        await message.edit({ components });

        return interaction.editReply(this.t('itemAdded', { locale }));
      } catch {
        return interaction.editReply(this.t('itemAddError', { locale }));
      }
    }

    if (subcommand === 'item') {
      const menuId = options.getString('menu', true);

      components.push(...message.components.map(row => {
        if (row.components[0].type !== SelectMenu) return row;
        if (row.components.every(element => element.customId !== menuId)) return row;

        return new ActionRowBuilder<SelectMenuBuilder>(row.toJSON())
          .setComponents(row.components.map(element => {
            const newSelectMenu = new SelectMenuBuilder(<APISelectMenuComponent>element.toJSON());

            if (element.customId !== menuId) return newSelectMenu;

            newSelectMenu.addOptions(new SelectMenuOptionBuilder()
              .setDefault(Boolean(item_default))
              .setDescription(description)
              .setEmoji(emoji)
              .setLabel(`${label} 0`)
              .setValue(JSON.stringify({
                count: 0,
                d: Date.now(),
                roleId: role.id,
              })))
              .setMaxValues(newSelectMenu.options.length);

            return newSelectMenu.setOptions(newSelectMenu.options.sort(a => a.data.default ? -1 : 1));
          }));
      }));

      try {
        await message.edit({ components });

        return interaction.editReply(this.t('itemAdded', { locale }));
      } catch {
        return interaction.editReply(this.t('itemAddError', { locale }));
      }
    }
  }

  async remove(interaction: ChatInputCommandInteraction): Promise<any> {
    const { locale, options } = interaction;

    const channel = <TextChannel>options.getChannel('channel', true);
    const message_id = <string>options.getString('message_id', true).match(this.pattern.messageURL)?.[1];

    const message = await channel.messages.fetch(message_id);

    if (!message) return interaction.editReply(this.t('message404', { locale }));
    if (!message.editable) return interaction.editReply(this.t('messageNotEditable', { locale }));

    const subcommand = options.getSubcommand();

    const menuId = options.getString('menu', true);

    if (subcommand === 'menu') {
      const components = message.components.filter(row =>
        row.components[0].type !== SelectMenu ||
        row.components.some(selectmenu => selectmenu.customId !== menuId));

      try {
        await message.edit({ components });

        return interaction.editReply(this.t('itemRemoved', { locale }));
      } catch {
        return interaction.editReply(this.t('itemRemoveError', { locale }));
      }
    }

    if (subcommand === 'item') {
      const item = options.getString('item', true);

      const components = message.components.map(row => {
        if (row.components[0].type !== SelectMenu) return row;
        if (row.components.every(element => element.customId !== menuId)) return row;

        return new ActionRowBuilder<SelectMenuBuilder>(row.toJSON())
          .setComponents(row.components.map(element => {
            const newSelectMenu = new SelectMenuBuilder(<APISelectMenuComponent>element.toJSON());

            if (element.customId !== menuId) return newSelectMenu;

            return newSelectMenu.setOptions(newSelectMenu.options.filter(option => option.data.value !== item))
              .setMaxValues(newSelectMenu.options.length);
          }));
      });

      try {
        await message.edit({ components });

        return interaction.editReply(this.t('itemRemoved', { locale }));
      } catch {
        return interaction.editReply(this.t('itemRemoveError', { locale }));
      }
    }
  }

  async editAutocomplete(
    interaction: AutocompleteInteraction<'cached'>,
    res: ApplicationCommandOptionChoiceData[] = [],
  ) {
    if (interaction.responded) return;

    const { client, guild, options } = interaction;

    const channelId = <string>options.get('channel', true).value;

    const channel = await guild.channels.fetch(channelId);

    if (!(channel instanceof TextChannel))
      return interaction.respond(res);

    const focused = options.getFocused(true);
    const pattern = RegExp(`${focused.value}`, 'i');

    if (focused.name === 'message_id') {
      const messages = await channel.messages.fetch({ limit: 100 });

      const messagesArray = messages.filter(m =>
        m.author.id === client.user?.id &&
        m.components.some(c => RegExp(`"c":"${this.data.name}"`).test(c.components[0].customId!)) &&
        pattern.test(m.id)).toJSON();

      for (let i = 0; i < messagesArray.length; i++) {
        const { embeds, id } = messagesArray[i];

        const { title, description } = embeds[0];

        const name = [
          id,
          title ? ` | ${title}` : '',
          description ? ` | ${description}` : '',
        ].join('').slice(0, 100);

        if (title || description)
          res.push({
            name,
            value: `${id}`,
          });

        if (res.length === 25) break;
      }
    }

    if (focused.name === 'menu') {
      const message_id = <string>options.getString('message_id', true).match(this.pattern.messageURL)?.[1];

      const message = await channel.messages.fetch(message_id);

      if (!(message && message.editable)) return interaction.respond(res);

      for (let i = 0; i < message.components.length; i++) {
        const component = message.components[i];

        if (component.components[0].type !== SelectMenu) continue;

        for (let i2 = 0; i2 < component.components.length; i2++) {
          const element = <SelectMenuComponent>component.components[i2];

          const { customId, disabled, maxValues, placeholder } = element;

          const name = [
            `${i + 1} - ${i2 + 1}`,
            placeholder ? ` | ${placeholder}` : '',
            maxValues ? ` | ${maxValues} ${maxValues > 1 ? 'options' : 'option'}` : '',
            disabled ? ' | disabled' : '',
          ].join('').slice(0, 100);

          if (pattern.test(name))
            res.push({
              name,
              value: `${customId}`,
            });
        }
      }
    }

    if (focused.name === 'item') {
      const menuId = options.getString('menu', true);
      const message_id = <string>options.getString('message_id', true).match(this.pattern.messageURL)?.[1];

      const message = await channel.messages.fetch(message_id);

      if (!(message && message.editable)) return interaction.respond(res);

      for (let i = 0; i < message.components.length; i++) {
        const component = message.components[i];

        if (component.components[0].type !== SelectMenu) continue;

        for (let i2 = 0; i2 < component.components.length; i2++) {
          const element = <SelectMenuComponent>component.components[i2];

          const { customId, options: menuOptions } = element;

          if (customId !== menuId) continue;

          for (let i3 = 0; i3 < menuOptions.length; i3++) {
            const option = menuOptions[i3];

            const { description, emoji, label, value } = option;

            const { roleId } = <SelectRolesItemOptionValue>JSON.parse(value);

            const role = await guild.roles.fetch(roleId);

            const name = [
              emoji?.id ? '' : emoji?.name,
              label ? label : ` Item ${i2 + 1}`,
              ` | ${role?.name}`,
              ` | ${roleId}`,
              description ? ` | ${description}` : '',
            ].join('').slice(0, 100);

            res.push({
              name,
              value,
            });
          }
        }
      }
    }

    return interaction.respond(res);
  }

  async addAutocomplete(interaction: AutocompleteInteraction<'cached'>) {
    return this.editAutocomplete(interaction);
  }

  async removeAutocomplete(interaction: AutocompleteInteraction<'cached'>) {
    return this.editAutocomplete(interaction);
  }

  async bulk(interaction: ChatInputCommandInteraction): Promise<any> {
    const { options } = interaction;

    const subcommand = options.getSubcommand();

    return this[`bulk_${subcommand}`]?.(interaction);
  }

  async bulk_create(interaction: ChatInputCommandInteraction<'cached'>): Promise<any> {
    const { guild, locale, options } = interaction;

    const rolesId = options.getString('roles', true).match(/\d{17,}/g)
      ?.map(id => guild.roles.fetch(id));

    if (!rolesId)
      return interaction.editReply('No IDs were found in the roles input.');

    const rolesArray = await Promise.all(rolesId)
      .then(roles => <Role[]>roles.filter(role => role));

    if (!rolesArray.length)
      return interaction.editReply('No roles were found in the roles input.');

    const defaultRole = options.getRole('default_role');
    const menuPlaceholder = options.getString('menu_place_holder');

    const roles = this.Util.splitArrayInGroups(rolesArray.slice(0, 125), 25);

    const components = this.Util.createSelectRoles({ roles, defaultRole, menuPlaceholder });

    const channel = <TextChannel>options.getChannel('channel') ?? interaction.channel;

    const [, title, description] = options.getString('text')?.match(this.pattern.embed) ?? [];

    const embeds = [
      new EmbedBuilder()
        .setColor('Random')
        .setDescription(description?.replace(/(\s{2})/g, '\n') || null)
        .setTitle(title ? title : description ? null : 'SelectRoles'),
    ];

    try {
      await channel.send({ components, embeds });

      return interaction.editReply(this.t('?created', { locale, string: 'Select Role' }));
    } catch {
      return interaction.editReply(this.t('createError', { locale, string: 'Select Role' }));
    }
  }

  async bulk_add(interaction: ChatInputCommandInteraction<'cached'>) {
    const { guild, locale, options } = interaction;

    let rolesId = options.getString('roles', true).match(/\d{17,}/g);

    if (!rolesId)
      return interaction.editReply('No IDs were found in the roles input.');

    const channel = <TextChannel>options.getChannel('channel', true);
    const message_id = <string>options.getString('message_id', true).match(this.pattern.messageURL)?.[1];

    const message = await channel.messages.fetch(message_id);

    if (!message) return interaction.editReply(this.t('message404', { locale }));
    if (!message.editable) return interaction.editReply(this.t('messageNotEditable', { locale }));

    rolesId = this.Util.filterRolesId(message.components, rolesId);

    const rolesArray = await Promise.all(rolesId.map(id => guild.roles.fetch(id)))
      .then(roles => <Role[]>roles.filter(role => role).slice(0, 125));

    if (!rolesArray.length)
      return interaction.editReply('No roles were found in the roles input.');

    const menuPlaceholder = options.getString('menu_place_holder');

    let components = this.Util.addSelectRoles(rolesArray, message.components, menuPlaceholder).slice(0, 5);

    const defaultRole = options.getRole('default_role');

    if (defaultRole)
      components = this.Util.setDefaultRole(message.components, defaultRole);

    try {
      await message.edit({ components });

      return interaction.editReply(this.t('itemAdded', { locale }));
    } catch {
      return interaction.editReply(this.t('itemAddError', { locale }));
    }
  }

  async bulk_remove(interaction: ChatInputCommandInteraction<'cached'>): Promise<any> {
    const { locale, options } = interaction;

    const rolesId = options.getString('roles', true).match(/\d{17,}/g);

    if (!rolesId)
      return interaction.editReply('No IDs were found in the roles input.');

    const channel = <TextChannel>options.getChannel('channel', true);
    const message_id = <string>options.getString('message_id', true).match(this.pattern.messageURL)?.[1];

    const message = await channel.messages.fetch(message_id);

    if (!message) return interaction.editReply(this.t('message404', { locale }));
    if (!message.editable) return interaction.editReply(this.t('messageNotEditable', { locale }));

    const components = this.Util.removeSelectRoles(message.components, rolesId);

    try {
      await message.edit({ components });

      return interaction.editReply(this.t('itemRemoved', { locale }));
    } catch {
      return interaction.editReply(this.t('itemRemoveError', { locale }));
    }
  }

  async bulkAutocomplete(interaction: AutocompleteInteraction): Promise<any> {
    const { options } = interaction;

    const subcommand = options.getSubcommand();

    return this[`bulk_${subcommand}Autocomplete`]?.(interaction);
  }

  async bulk_addAutocomplete(interaction: AutocompleteInteraction<'cached'>) {
    return this.editAutocomplete(interaction);
  }

  async bulk_removeAutocomplete(interaction: AutocompleteInteraction<'cached'>) {
    return this.editAutocomplete(interaction);
  }
}