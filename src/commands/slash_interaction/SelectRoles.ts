import { ActionRowBuilder, APIActionRowComponent, APISelectMenuComponent, ChatInputCommandInteraction, ComponentType, EmbedBuilder, GuildTextBasedChannel, PermissionFlagsBits, Role, SelectMenuBuilder, SelectMenuOptionBuilder } from 'discord.js';
import type { SelectRolesOptionValue } from '../../@types';
import { SlashCommand } from '../../structures';

export default class SelectRoles extends SlashCommand {
  [x: string]: any;
  CommandNameRegExp = /"c":"selectroles"/;

  constructor() {
    super({
      category: 'Moderation',
      appPermissions: ['EmbedLinks', 'ManageRoles', 'SendMessages'],
      userPermissions: ['ManageRoles'],
    });

    this.data.setName('selectroles')
      .setDescription('Manage roles with a select menu.');
  }

  build() {
    return this.data
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
        .addStringOption(option => option.setName('option_name')
          .setDescription('The name of the option. {0,83} - default: <role>')
          .setNameLocalizations(this.getLocalizations('selectrolesCreateOptionNameName'))
          .setDescriptionLocalizations(this.getLocalizations('selectrolesCreateOptionNameDescription'))
          .setMaxLength(83))
        .addStringOption(option => option.setName('option_description')
          .setDescription('The description of the option. {0,100}')
          .setNameLocalizations(this.getLocalizations('selectrolesCreateOptionDescriptionName'))
          .setDescriptionLocalizations(this.getLocalizations('selectrolesCreateOptionDescriptionDescription')))
        .addBooleanOption(option => option.setName('option_default')
          .setDescription('Used to always add this role with other roles.')
          .setNameLocalizations(this.getLocalizations('selectrolesCreateOptionDefaultName'))
          .setDescriptionLocalizations(this.getLocalizations('selectrolesCreateOptionDefaultDescription')))
        .addStringOption(option => option.setName('option_emoji')
          .setDescription('The emoji of the option.')
          .setNameLocalizations(this.getLocalizations('selectrolesCreateOptionEmojiName'))
          .setDescriptionLocalizations(this.getLocalizations('selectrolesCreateOptionEmojiDescription')))
        .addBooleanOption(option => option.setName('menu_disabled')
          .setDescription('Whether the menu is disabled.')
          .setNameLocalizations(this.getLocalizations('selectrolesCreateMenuDisabledName'))
          .setDescriptionLocalizations(this.getLocalizations('selectrolesCreateMenuDisabledDescription')))
        .addStringOption(option => option.setName('menu_place_holder')
          .setDescription('The placeholder of the menu. {0,150}')
          .setNameLocalizations(this.getLocalizations('selectrolesCreateMenuPlaceHolderName'))
          .setDescriptionLocalizations(this.getLocalizations('selectrolesCreateMenuPlaceHolderDescription'))
          .setMaxLength(150))
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
            .setDescriptionLocalizations(this.getLocalizations('selectrolesEditMenuMenuPlaceHolderDescription'))
            .setMaxLength(150)))
        .addSubcommand(subcommand => subcommand.setName('option')
          .setDescription('Edit the option of the Select roles.')
          .setNameLocalizations(this.getLocalizations('selectrolesEditOptionName'))
          .setDescriptionLocalizations(this.getLocalizations('selectrolesEditOptionDescription'))
          .addChannelOption(option => option.setName('channel')
            .setDescription('Select the channel of the option.')
            .setNameLocalizations(this.getLocalizations('selectrolesEditOptionChannelName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesEditOptionChannelDescription'))
            .setRequired(true)
            .addChannelTypes(...this.GuildTextChannelTypes))
          .addStringOption(option => option.setName('message_id')
            .setDescription('Message ID | Message URL')
            .setNameLocalizations(this.getLocalizations('selectrolesEditOptionMessageIdName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesEditOptionMessageIdDescription'))
            .setAutocomplete(true)
            .setRequired(true))
          .addStringOption(option => option.setName('menu')
            .setDescription('Select the menu of the option.')
            .setNameLocalizations(this.getLocalizations('selectrolesEditOptionMenuName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesEditOptionMenuDescription'))
            .setAutocomplete(true)
            .setRequired(true))
          .addStringOption(option => option.setName('option')
            .setDescription('Select the option.')
            .setNameLocalizations(this.getLocalizations('selectrolesEditOptionOptionName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesEditOptionOptionDescription'))
            .setAutocomplete(true)
            .setRequired(true))
          .addRoleOption(option => option.setName('role')
            .setDescription('Select a new role.')
            .setNameLocalizations(this.getLocalizations('selectrolesEditOptionRoleName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesEditOptionRoleDescription')))
          .addStringOption(option => option.setName('option_name')
            .setDescription('Input a new name for the option. {0,83}')
            .setNameLocalizations(this.getLocalizations('selectrolesEditOptionOptionNameName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesEditOptionOptionNameDescription'))
            .setMaxLength(83))
          .addStringOption(option => option.setName('option_description')
            .setDescription('Input a new description for the option. {0,100}')
            .setNameLocalizations(this.getLocalizations('selectrolesEditOptionOptionDescriptionName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesEditOptionOptionDescriptionDescription')))
          .addBooleanOption(option => option.setName('option_default')
            .setDescription('Used to always add this role with other roles.')
            .setNameLocalizations(this.getLocalizations('selectrolesEditOptionOptionDefaultName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesEditOptionOptionDefaultDescription')))
          .addStringOption(option => option.setName('option_emoji')
            .setDescription('Input a new emoji for the option.')
            .setNameLocalizations(this.getLocalizations('selectrolesEditOptionOptionEmojiName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesEditOptionOptionEmojiDescription')))))
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
          .addStringOption(option => option.setName('option_name')
            .setDescription('The name of the option. {0,83} - default: <role>')
            .setNameLocalizations(this.getLocalizations('selectrolesAddMenuOptionNameName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesAddMenuOptionNameDescription'))
            .setMaxLength(83))
          .addStringOption(option => option.setName('option_description')
            .setDescription('The description of the option. {0,100}')
            .setNameLocalizations(this.getLocalizations('selectrolesAddMenuOptionDescriptionName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesAddMenuOptionDescriptionDescription')))
          .addBooleanOption(option => option.setName('option_default')
            .setDescription('Used to always add this role with other roles.')
            .setNameLocalizations(this.getLocalizations('selectrolesAddMenuOptionDefaultName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesAddMenuOptionDefaultDescription')))
          .addStringOption(option => option.setName('option_emoji')
            .setDescription('The emoji of the option.')
            .setNameLocalizations(this.getLocalizations('selectrolesAddMenuOptionEmojiName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesAddMenuOptionEmojiDescription')))
          .addBooleanOption(option => option.setName('menu_disabled')
            .setDescription('Whether the menu is disabled.')
            .setNameLocalizations(this.getLocalizations('selectrolesAddMenuMenuDisabledName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesAddMenuMenuDisabledDescription')))
          .addStringOption(option => option.setName('menu_place_holder')
            .setDescription('The place holder of the menu. {0,150}')
            .setNameLocalizations(this.getLocalizations('selectrolesAddMenuMenuPlaceHolderName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesAddMenuMenuPlaceHolderDescription'))
            .setMaxLength(150)))
        .addSubcommand(subcommand => subcommand.setName('option')
          .setDescription('Add an option to the Select roles.')
          .setNameLocalizations(this.getLocalizations('selectrolesAddOptionName'))
          .setDescriptionLocalizations(this.getLocalizations('selectrolesAddOptionDescription'))
          .addChannelOption(option => option.setName('channel')
            .setDescription('Select the channel of the option.')
            .setNameLocalizations(this.getLocalizations('selectrolesAddOptionChannelName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesAddOptionChannelDescription'))
            .setRequired(true)
            .addChannelTypes(...this.GuildTextChannelTypes))
          .addStringOption(option => option.setName('message_id')
            .setDescription('Message ID | Message URL')
            .setNameLocalizations(this.getLocalizations('selectrolesAddOptionMessageIdName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesAddOptionMessageIdDescription'))
            .setAutocomplete(true)
            .setRequired(true))
          .addStringOption(option => option.setName('menu')
            .setDescription('Select the menu of the option.')
            .setNameLocalizations(this.getLocalizations('selectrolesAddOptionMenuName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesAddOptionMenuDescription'))
            .setAutocomplete(true)
            .setRequired(true))
          .addRoleOption(option => option.setName('role')
            .setDescription('Select a role to add to the option.')
            .setNameLocalizations(this.getLocalizations('selectrolesAddOptionRoleName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesAddOptionRoleDescription'))
            .setRequired(true))
          .addStringOption(option => option.setName('option_name')
            .setDescription('The name of the option. {0,83} - default: <role>')
            .setNameLocalizations(this.getLocalizations('selectrolesAddOptionOptionNameName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesAddOptionOptionNameDescription'))
            .setMaxLength(83))
          .addStringOption(option => option.setName('option_description')
            .setDescription('The description of the option. {0,100}')
            .setNameLocalizations(this.getLocalizations('selectrolesAddOptionOptionDescriptionName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesAddOptionOptionDescriptionDescription')))
          .addBooleanOption(option => option.setName('option_default')
            .setDescription('Used to always add this role with other roles.')
            .setNameLocalizations(this.getLocalizations('selectrolesAddOptionOptionDefaultName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesAddOptionOptionDefaultDescription')))
          .addStringOption(option => option.setName('option_emoji')
            .setDescription('The emoji of the option.')
            .setNameLocalizations(this.getLocalizations('selectrolesAddOptionOptionEmojiName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesAddOptionOptionEmojiDescription')))))
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
        .addSubcommand(subcommand => subcommand.setName('option')
          .setDescription('Remove an option from the Select roles.')
          .setNameLocalizations(this.getLocalizations('selectrolesRemoveOptionName'))
          .setDescriptionLocalizations(this.getLocalizations('selectrolesRemoveOptionDescription'))
          .addChannelOption(option => option.setName('channel')
            .setDescription('Select the channel of the option.')
            .setNameLocalizations(this.getLocalizations('selectrolesRemoveOptionChannelName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesRemoveOptionChannelDescription'))
            .setRequired(true)
            .addChannelTypes(...this.GuildTextChannelTypes))
          .addStringOption(option => option.setName('message_id')
            .setDescription('Message ID | Message URL')
            .setNameLocalizations(this.getLocalizations('selectrolesRemoveOptionMessageIdName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesRemoveOptionMessageIdDescription'))
            .setAutocomplete(true)
            .setRequired(true))
          .addStringOption(option => option.setName('menu')
            .setDescription('Select the menu of the option.')
            .setNameLocalizations(this.getLocalizations('selectrolesRemoveOptionMenuName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesRemoveOptionMenuDescription'))
            .setAutocomplete(true)
            .setRequired(true))
          .addStringOption(option => option.setName('option')
            .setDescription('Select the option to remove.')
            .setNameLocalizations(this.getLocalizations('selectrolesRemoveOptionOptionName'))
            .setDescriptionLocalizations(this.getLocalizations('selectrolesRemoveOptionOptionDescription'))
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
            .setNameLocalizations(this.getLocalizations('selectrolesBulkCreateMenuPlaceHolderName'))
            .setMaxLength(150)))
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
            .setDescriptionLocalizations(this.getLocalizations('selectrolesBulkAddMenuPlaceHolderDescription'))
            .setMaxLength(150)))
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

  async execute(interaction: ChatInputCommandInteraction<'cached'>) {
    const { memberPermissions, options } = interaction;

    const userPerms = memberPermissions.missing(this.props!.userPermissions!);

    if (userPerms.length)
      return this.replyMissingPermission(interaction, userPerms, 'missingUserPermission');

    const subcommand = options.getSubcommandGroup() ?? options.getSubcommand();

    await interaction.deferReply({ ephemeral: true });

    return this[subcommand]?.(interaction);
  }

  async create(interaction: ChatInputCommandInteraction<'cached'>): Promise<any> {
    const { locale, options } = interaction;

    const role = options.getRole('role', true);
    const channel = <GuildTextBasedChannel>options.getChannel('channel') ?? interaction.channel;
    const option_description = options.getString('option_description')?.slice(0, 100);
    const option_default = Boolean(options.getBoolean('option_default'));
    const option_emoji = options.getString('option_emoji') ?? {};
    const option_name = (options.getString('option_name') ?? role.name).slice(0, 83);
    const menu_disabled = Boolean(options.getBoolean('menu_disabled'));
    const menu_place_holder = options.getString('menu_place_holder')?.slice(0, 150) || '';
    const [, title, description] = options.getString('text')?.match(this.regexp.embed) ?? [];

    const components = [
      new ActionRowBuilder<SelectMenuBuilder>()
        .addComponents(new SelectMenuBuilder()
          .setCustomId(JSON.stringify({
            c: this.data.name,
            count: 0,
            d: Date.now(),
          }))
          .setDisabled(menu_disabled)
          .setMaxValues(1)
          .setOptions(new SelectMenuOptionBuilder({
            default: option_default,
            description: option_description,
            emoji: option_emoji,
            label: `${option_name} 0`,
            value: JSON.stringify({
              count: 0,
              id: role.id,
            }),
          }))
          .setPlaceholder(menu_place_holder)),
    ];

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

  async edit(interaction: ChatInputCommandInteraction<'cached'>): Promise<any> {
    const { locale, options } = interaction;

    const channel = <GuildTextBasedChannel>options.getChannel('channel', true);
    const message_id = <string>options.getString('message_id', true).match(this.regexp.messageURL)?.[1];

    const message = channel.messages.cache.get(message_id);
    if (!message) return interaction.editReply(this.t('message404', { locale }));
    if (!message.editable) return interaction.editReply(this.t('messageNotEditable', { locale }));

    const subcommand = options.getSubcommand();

    if (subcommand === 'message') {
      const [, title, description] = options.getString('text', true).match(this.regexp.embed) ?? [];

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
        const rowJson = <APIActionRowComponent<APISelectMenuComponent>>row.toJSON();

        if (rowJson.components[0].type !== ComponentType.SelectMenu) return row;

        return new ActionRowBuilder<SelectMenuBuilder>()
          .addComponents(rowJson.components.map(element => {
            const newSelectMenu = new SelectMenuBuilder(element);

            if (element.custom_id !== menuId) return newSelectMenu;

            return newSelectMenu.setDisabled(menu_disabled ?? element.disabled)
              .setPlaceholder(menu_place_holder ?? element.placeholder);
          }));
      });

      try {
        await message.edit({ components });

        return interaction.editReply(this.t('?edited', { locale, string: 'Select Role' }));
      } catch {
        return interaction.editReply(this.t('editError', { locale, string: 'Select Role' }));
      }
    }

    const optionId = options.getString('option', true);

    if (subcommand === 'option') {
      const role = options.getRole('role')!;

      if (this.Util.componentsHasRoles(message.components, [role]))
        return interaction.editReply(this.t('itemAddError', { locale }));

      const option_description = options.getString('option_description')?.slice(0, 100);
      const option_default = options.getBoolean('option_default');
      const option_emoji = options.getString('option_emoji');
      const option_name = options.getString('option_name')?.slice(0, 83);

      const components = message.components.map(row => {
        const rowJson = <APIActionRowComponent<APISelectMenuComponent>>row.toJSON();

        if (rowJson.components[0].type !== ComponentType.SelectMenu) return row;

        return new ActionRowBuilder<SelectMenuBuilder>()
          .addComponents(rowJson.components.map(element => {
            return new SelectMenuBuilder(element)
              .setOptions(element.options.map(option => {
                if (option.value !== optionId) {
                  if (typeof option_default === 'boolean')
                    option.default = false;

                  return option;
                }

                const value = <SelectRolesOptionValue>JSON.parse(option.value);

                return new SelectMenuOptionBuilder({
                  default: option_default ?? option.default,
                  description: option_description ?? option.description,
                  emoji: option_emoji ?? option.emoji,
                  label: option_name ? `${option_name} ${value.count}` : option.label ?? option.label,
                  value: option.value,
                });
              }));
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

  async add(interaction: ChatInputCommandInteraction<'cached'>): Promise<any> {
    const { locale, options } = interaction;

    const channel = <GuildTextBasedChannel>options.getChannel('channel', true);
    const message_id = <string>options.getString('message_id', true).match(this.regexp.messageURL)?.[1];

    const message = await channel.messages.safeFetch(message_id);
    if (!message) return interaction.editReply(this.t('message404', { locale }));
    if (!message.editable) return interaction.editReply(this.t('messageNotEditable', { locale }));

    const role = options.getRole('role', true);

    if (this.Util.componentsHasRoles(message.components, [role]))
      return interaction.editReply(this.t('itemAddError', { locale }));

    const option_default = options.getBoolean('option_default');
    const option_description = options.getString('option_description')?.slice(0, 100);
    const option_emoji = options.getString('option_emoji');
    const option_name = (options.getString('option_name') ?? role.name).slice(0, 83);

    const subcommand = options.getSubcommand();

    if (subcommand === 'menu') {
      const menu_disabled = options.getBoolean('menu_disabled')!;
      const menu_place_holder = options.getString('menu_place_holder')?.slice(0, 150) ?? '';

      let components = [
        ...message.components,
        new ActionRowBuilder<SelectMenuBuilder>()
          .addComponents(new SelectMenuBuilder()
            .setCustomId(JSON.stringify({
              c: this.data.name,
              count: 0,
              d: Date.now(),
            }))
            .setDisabled(menu_disabled)
            .setMaxValues(1)
            .setOptions(new SelectMenuOptionBuilder({
              default: Boolean(option_default),
              description: option_description,
              emoji: option_emoji ?? {},
              label: `${option_name} 0`,
              value: JSON.stringify({
                count: 0,
                id: role.id,
              }),
            }))
            .setPlaceholder(menu_place_holder)),
      ];

      if (typeof option_default === 'boolean')
        components = this.Util.setDefaultRole(components, role);

      try {
        await message.edit({ components });

        return interaction.editReply(this.t('itemAdded', { locale }));
      } catch {
        return interaction.editReply(this.t('itemAddError', { locale }));
      }
    }

    const menuId = options.getString('menu', true);

    if (subcommand === 'option') {
      let components = this.Util.addOptionsToSelectMenuInRow(message.components, menuId, [
        new SelectMenuOptionBuilder({
          default: Boolean(option_default),
          description: option_description,
          emoji: option_emoji ?? {},
          label: `${option_name} 0`,
          value: JSON.stringify({
            count: 0,
            id: role.id,
          }),
        }),
      ]);

      if (typeof option_default === 'boolean')
        components = this.Util.setDefaultRole(components, role);

      try {
        await message.edit({ components });

        return interaction.editReply(this.t('itemAdded', { locale }));
      } catch {
        return interaction.editReply(this.t('itemAddError', { locale }));
      }
    }
  }

  async remove(interaction: ChatInputCommandInteraction<'cached'>): Promise<any> {
    const { locale, options } = interaction;

    const channel = <GuildTextBasedChannel>options.getChannel('channel', true);
    const message_id = <string>options.getString('message_id', true).match(this.regexp.messageURL)?.[1];

    const message = await channel.messages.safeFetch(message_id);
    if (!message) return interaction.editReply(this.t('message404', { locale }));
    if (!message.editable) return interaction.editReply(this.t('messageNotEditable', { locale }));

    const subcommand = options.getSubcommand();

    const menuId = options.getString('menu', true);

    if (subcommand === 'menu') {
      const components = message.components.filter(row => row.components[0].customId !== menuId);

      try {
        await message.edit({ components });

        return interaction.editReply(this.t('itemRemoved', { locale }));
      } catch {
        return interaction.editReply(this.t('itemRemoveError', { locale }));
      }
    }

    const optionId = options.getString('option', true);

    if (subcommand === 'option') {
      const components = this.Util.removeOptionsFromSelectMenu(message.components, menuId, optionId);

      try {
        await message.edit({ components });

        return interaction.editReply(this.t('itemRemoved', { locale }));
      } catch {
        return interaction.editReply(this.t('itemRemoveError', { locale }));
      }
    }
  }

  async bulk(interaction: ChatInputCommandInteraction<'cached'>): Promise<any> {
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

    const roles = await Promise.all(rolesId)
      .then(rs => <Role[]>rs.filter(role => role));

    if (!roles.length)
      return interaction.editReply('No roles were found in the roles input.');

    const defaultRole = options.getRole('default_role');
    const menuPlaceholder = options.getString('menu_place_holder');

    const components = this.Util.createSelectMenuByRoles({ roles, defaultRole, menuPlaceholder });

    const channel = <GuildTextBasedChannel>options.getChannel('channel') ?? interaction.channel;

    const [, title, description] = options.getString('text')?.match(this.regexp.embed) ?? [];

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

    const rolesId = options.getString('roles', true).match(/\d{17,}/g);
    if (!rolesId)
      return interaction.editReply('No IDs were found in the roles input.');

    const channel = <GuildTextBasedChannel>options.getChannel('channel', true);
    const message_id = <string>options.getString('message_id', true).match(this.regexp.messageURL)?.[1];

    const message = await channel.messages.safeFetch(message_id);
    if (!message) return interaction.editReply(this.t('message404', { locale }));
    if (!message.editable) return interaction.editReply(this.t('messageNotEditable', { locale }));

    const roles = await Promise.all(this.Util.filterRolesId(message.components, rolesId).map(id =>
      guild.roles.fetch(id))).then(rs => <Role[]>rs.filter(r => r).slice(0, 125));
    if (!roles.length)
      return interaction.editReply('No new role were found in roles input.');

    const menuPlaceholder = options.getString('menu_place_holder');

    const defaultRole = options.getRole('default_role');

    const components = this.Util.addSelectMenuByRoles({ defaultRole, menuPlaceholder, roles }, message.components)
      .slice(0, 5);

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

    const channel = <GuildTextBasedChannel>options.getChannel('channel', true);
    const message_id = <string>options.getString('message_id', true).match(this.regexp.messageURL)?.[1];

    const message = await channel.messages.safeFetch(message_id);

    if (!message) return interaction.editReply(this.t('message404', { locale }));
    if (!message.editable) return interaction.editReply(this.t('messageNotEditable', { locale }));

    const components = this.Util.removeOptionsByRolesFromSelectMenu(message.components, rolesId);

    try {
      await message.edit({ components });

      return interaction.editReply(this.t('itemRemoved', { locale }));
    } catch {
      return interaction.editReply(this.t('itemRemoveError', { locale }));
    }
  }
}