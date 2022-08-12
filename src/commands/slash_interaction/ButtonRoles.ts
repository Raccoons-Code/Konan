import { ActionRowBuilder, APIActionRowComponent, APIButtonComponent, APIButtonComponentWithCustomId, ApplicationCommandOptionChoiceData, AutocompleteInteraction, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, ComponentType, EmbedBuilder, GuildTextBasedChannel, InteractionType, PermissionFlagsBits, Role, SlashCommandBuilder } from 'discord.js';
import type { ButtonRolesCustomId } from '../../@types';
import { SlashCommand } from '../../structures';

const { ApplicationCommandAutocomplete } = InteractionType;

export default class ButtonRoles extends SlashCommand {
  [x: string]: any;
  CommandNameRegExp = /"c":"buttonroles"/;

  constructor() {
    super({
      category: 'Moderation',
      appPermissions: ['EmbedLinks', 'ManageRoles', 'SendMessages'],
      userPermissions: ['ManageRoles'],
    });

    this.data = new SlashCommandBuilder().setName('buttonroles')
      .setDescription('Manage button roles.')
      .setDMPermission(false)
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
      .setNameLocalizations(this.getLocalizations('buttonrolesName'))
      .setDescriptionLocalizations(this.getLocalizations('buttonrolesDescription'))
      .addSubcommand(subcommand => subcommand.setName('create')
        .setDescription('Create a button role.')
        .setNameLocalizations(this.getLocalizations('buttonrolesCreateName'))
        .setDescriptionLocalizations(this.getLocalizations('buttonrolesCreateDescription'))
        .addRoleOption(option => option.setName('role')
          .setDescription('Select the role to use.')
          .setNameLocalizations(this.getLocalizations('buttonrolesCreateRoleName'))
          .setDescriptionLocalizations(this.getLocalizations('buttonrolesCreateRoleDescription'))
          .setRequired(true))
        .addStringOption(option => option.setName('text')
          .setDescription('The Button Role text. Title {0,256} | Description {0,4096} - default: ButtonRoles')
          .setNameLocalizations(this.getLocalizations('buttonrolesCreateTextName'))
          .setDescriptionLocalizations(this.getLocalizations('buttonrolesCreateTextDescription')))
        .addStringOption(option => option.setName('button_name')
          .setDescription('The name of the button. Button name {0,63} - default: <role>')
          .setNameLocalizations(this.getLocalizations('buttonrolesCreateButtonNameName'))
          .setDescriptionLocalizations(this.getLocalizations('buttonrolesCreateButtonNameDescription'))
          .setMaxLength(63))
        .addStringOption(option => option.setName('button_emoji')
          .setDescription('The emoji of the button.')
          .setNameLocalizations(this.getLocalizations('buttonrolesCreateButtonEmojiName'))
          .setDescriptionLocalizations(this.getLocalizations('buttonrolesCreateButtonEmojiDescription')))
        .addBooleanOption(option => option.setName('button_disabled')
          .setDescription('Whether the button is disabled.')
          .setNameLocalizations(this.getLocalizations('buttonrolesCreateButtonDisabledName'))
          .setDescriptionLocalizations(this.getLocalizations('buttonrolesCreateButtonDisabledDescription')))
        .addIntegerOption(option => option.setName('button_style')
          .setDescription('Select the style of the button. default: Primary')
          .setNameLocalizations(this.getLocalizations('buttonrolesCreateButtonStyleName'))
          .setDescriptionLocalizations(this.getLocalizations('buttonrolesCreateButtonStyleDescription'))
          .setChoices(...this.ButtonStylesChoices))
        .addChannelOption(option => option.setName('channel')
          .setDescription('Select the channel. default: <current channel>')
          .setNameLocalizations(this.getLocalizations('buttonrolesCreateChannelName'))
          .setDescriptionLocalizations(this.getLocalizations('buttonrolesCreateChannelDescription'))
          .addChannelTypes(...this.GuildTextChannelTypes)))
      .addSubcommandGroup(subcommandgroup => subcommandgroup.setName('edit')
        .setDescription('Edit a button role.')
        .setNameLocalizations(this.getLocalizations('buttonrolesEditName'))
        .setDescriptionLocalizations(this.getLocalizations('buttonrolesEditDescription'))
        .addSubcommand(subcommand => subcommand.setName('message')
          .setDescription('Edit a text in a Button role.')
          .setNameLocalizations(this.getLocalizations('buttonrolesEditMessageName'))
          .setDescriptionLocalizations(this.getLocalizations('buttonrolesEditMessageDescription'))
          .addChannelOption(option => option.setName('channel')
            .setDescription('Select the channel.')
            .setNameLocalizations(this.getLocalizations('buttonrolesEditMessageChannelName'))
            .setDescriptionLocalizations(this.getLocalizations('buttonrolesEditMessageChannelDescription'))
            .setRequired(true)
            .addChannelTypes(...this.GuildTextChannelTypes))
          .addStringOption(option => option.setName('message_id')
            .setDescription('Message ID | Message URL')
            .setNameLocalizations(this.getLocalizations('buttonrolesEditMessageMessageIdName'))
            .setDescriptionLocalizations(this.getLocalizations('buttonrolesEditMessageMessageIdDescription'))
            .setAutocomplete(true)
            .setRequired(true))
          .addStringOption(option => option.setName('text')
            .setDescription('Input new text. Title {0,256} | Description {0,4096}')
            .setNameLocalizations(this.getLocalizations('buttonrolesEditMessageTextName'))
            .setDescriptionLocalizations(this.getLocalizations('buttonrolesEditMessageTextDescription'))
            .setRequired(true)))
        .addSubcommand(subcommand => subcommand.setName('button')
          .setDescription('Edit a button in a Button role.')
          .setNameLocalizations(this.getLocalizations('buttonrolesEditButtonName'))
          .setDescriptionLocalizations(this.getLocalizations('buttonrolesEditButtonDescription'))
          .addChannelOption(option => option.setName('channel')
            .setDescription('Select the channel.')
            .setNameLocalizations(this.getLocalizations('buttonrolesEditButtonChannelName'))
            .setDescriptionLocalizations(this.getLocalizations('buttonrolesEditButtonChannelDescription'))
            .setRequired(true)
            .addChannelTypes(...this.GuildTextChannelTypes))
          .addStringOption(option => option.setName('message_id')
            .setDescription('Message ID | Message URL')
            .setNameLocalizations(this.getLocalizations('buttonrolesEditButtonMessageIdName'))
            .setDescriptionLocalizations(this.getLocalizations('buttonrolesEditButtonMessageIdDescription'))
            .setAutocomplete(true)
            .setRequired(true))
          .addStringOption(option => option.setName('button')
            .setDescription('Select the button.')
            .setNameLocalizations(this.getLocalizations('buttonrolesEditButtonButtonName'))
            .setDescriptionLocalizations(this.getLocalizations('buttonrolesEditButtonButtonDescription'))
            .setAutocomplete(true)
            .setRequired(true))
          .addRoleOption(option => option.setName('role')
            .setDescription('Select a new role.')
            .setNameLocalizations(this.getLocalizations('buttonrolesEditButtonRoleName'))
            .setDescriptionLocalizations(this.getLocalizations('buttonrolesEditButtonRoleDescription')))
          .addStringOption(option => option.setName('button_name')
            .setDescription('Input a new name. {0,63}')
            .setNameLocalizations(this.getLocalizations('buttonrolesEditButtonButtonNameName'))
            .setDescriptionLocalizations(this.getLocalizations('buttonrolesEditButtonButtonNameDescription'))
            .setMaxLength(63))
          .addIntegerOption(option => option.setName('button_style')
            .setDescription('Select a new style.')
            .setNameLocalizations(this.getLocalizations('buttonrolesEditButtonButtonStyleName'))
            .setDescriptionLocalizations(this.getLocalizations('buttonrolesEditButtonButtonStyleDescription'))
            .setChoices(...this.ButtonStylesChoices))
          .addStringOption(option => option.setName('button_emoji')
            .setDescription('Input a new emoji.')
            .setNameLocalizations(this.getLocalizations('buttonrolesEditButtonButtonEmojiName'))
            .setDescriptionLocalizations(this.getLocalizations('buttonrolesEditButtonButtonEmojiDescription')))
          .addBooleanOption(option => option.setName('button_disabled')
            .setDescription('Whether the button is disabled.')
            .setNameLocalizations(this.getLocalizations('buttonrolesEditButtonButtonDisabledName'))
            .setDescriptionLocalizations(this.getLocalizations('buttonrolesEditButtonButtonDisabledDescription')))))
      .addSubcommandGroup(subcommandgroup => subcommandgroup.setName('add')
        .setDescription('Add to Button role.')
        .setNameLocalizations(this.getLocalizations('buttonrolesAddName'))
        .setDescriptionLocalizations(this.getLocalizations('buttonrolesAddDescription'))
        .addSubcommand(subcommand => subcommand.setName('button')
          .setDescription('Add a new button in a Button role.')
          .setNameLocalizations(this.getLocalizations('buttonrolesAddButtonName'))
          .setDescriptionLocalizations(this.getLocalizations('buttonrolesAddButtonDescription'))
          .addChannelOption(option => option.setName('channel')
            .setDescription('Select the channel.')
            .setNameLocalizations(this.getLocalizations('buttonrolesAddButtonChannelName'))
            .setDescriptionLocalizations(this.getLocalizations('buttonrolesAddButtonChannelDescription'))
            .setRequired(true)
            .addChannelTypes(...this.GuildTextChannelTypes))
          .addStringOption(option => option.setName('message_id')
            .setDescription('Message ID | Message URL')
            .setNameLocalizations(this.getLocalizations('buttonrolesAddButtonMessageIdName'))
            .setDescriptionLocalizations(this.getLocalizations('buttonrolesAddButtonMessageIdDescription'))
            .setAutocomplete(true)
            .setRequired(true))
          .addRoleOption(option => option.setName('role')
            .setDescription('Select the role.')
            .setNameLocalizations(this.getLocalizations('buttonrolesAddButtonRoleName'))
            .setDescriptionLocalizations(this.getLocalizations('buttonrolesAddButtonRoleDescription'))
            .setRequired(true))
          .addStringOption(option => option.setName('button_name')
            .setDescription('Input the name of the button. {0,63} - default: <role>')
            .setNameLocalizations(this.getLocalizations('buttonrolesAddButtonButtonNameName'))
            .setDescriptionLocalizations(this.getLocalizations('buttonrolesAddButtonButtonNameDescription'))
            .setMaxLength(63))
          .addIntegerOption(option => option.setName('button_style')
            .setDescription('Select the style of the button. default: Primary')
            .setNameLocalizations(this.getLocalizations('buttonrolesAddButtonButtonStyleName'))
            .setDescriptionLocalizations(this.getLocalizations('buttonrolesAddButtonButtonStyleDescription'))
            .setChoices(...this.ButtonStylesChoices))
          .addStringOption(option => option.setName('button_emoji')
            .setDescription('Input the emoji of the button.')
            .setNameLocalizations(this.getLocalizations('buttonrolesAddButtonButtonEmojiName'))
            .setDescriptionLocalizations(this.getLocalizations('buttonrolesAddButtonButtonEmojiDescription')))
          .addBooleanOption(option => option.setName('button_disabled')
            .setDescription('Whether the button is disabled.')
            .setNameLocalizations(this.getLocalizations('buttonrolesAddButtonButtonDisabledName'))
            .setDescriptionLocalizations(this.getLocalizations('buttonrolesAddButtonButtonDisabledDescription')))))
      .addSubcommandGroup(subcommandgroup => subcommandgroup.setName('remove')
        .setDescription('Remove from a Button role.')
        .setNameLocalizations(this.getLocalizations('buttonrolesRemoveName'))
        .setDescriptionLocalizations(this.getLocalizations('buttonrolesRemoveDescription'))
        .addSubcommand(subcommand => subcommand.setName('button')
          .setDescription('Remove a button from a Button role.')
          .setNameLocalizations(this.getLocalizations('buttonrolesRemoveButtonName'))
          .setDescriptionLocalizations(this.getLocalizations('buttonrolesRemoveButtonDescription'))
          .addChannelOption(option => option.setName('channel')
            .setDescription('Select the channel.')
            .setNameLocalizations(this.getLocalizations('buttonrolesRemoveButtonChannelName'))
            .setDescriptionLocalizations(this.getLocalizations('buttonrolesRemoveButtonChannelDescription'))
            .setRequired(true)
            .addChannelTypes(...this.GuildTextChannelTypes))
          .addStringOption(option => option.setName('message_id')
            .setDescription('Message ID | Message URL')
            .setNameLocalizations(this.getLocalizations('buttonrolesRemoveButtonMessageIdName'))
            .setDescriptionLocalizations(this.getLocalizations('buttonrolesRemoveButtonMessageIdDescription'))
            .setAutocomplete(true)
            .setRequired(true))
          .addStringOption(option => option.setName('button')
            .setDescription('Select the button.')
            .setNameLocalizations(this.getLocalizations('buttonrolesRemoveButtonButtonName'))
            .setDescriptionLocalizations(this.getLocalizations('buttonrolesRemoveButtonButtonDescription'))
            .setAutocomplete(true)
            .setRequired(true))))
      .addSubcommandGroup(subcommandgroup => subcommandgroup.setName('bulk')
        .setDescription('Bulk manage Button roles.')
        .setNameLocalizations(this.getLocalizations('buttonrolesBulkName'))
        .setDescriptionLocalizations(this.getLocalizations('buttonrolesBulkDescription'))
        .addSubcommand(subcommand => subcommand.setName('create')
          .setDescription('Create a bulk of buttons in a Button role.')
          .setNameLocalizations(this.getLocalizations('buttonrolesBulkCreateName'))
          .setDescriptionLocalizations(this.getLocalizations('buttonrolesBulkCreateDescription'))
          .addStringOption(option => option.setName('roles')
            .setDescription('Input the roles.')
            .setNameLocalizations(this.getLocalizations('buttonrolesBulkCreateRolesName'))
            .setDescriptionLocalizations(this.getLocalizations('buttonrolesBulkCreateRolesDescription'))
            .setRequired(true))
          .addStringOption(option => option.setName('text')
            .setDescription('The Button Role text. Title {0,256} | Description {0,4096} - default: ButtonRoles')
            .setNameLocalizations(this.getLocalizations('buttonrolesBulkCreateTextName'))
            .setDescriptionLocalizations(this.getLocalizations('buttonrolesBulkCreateTextDescription')))
          .addChannelOption(option => option.setName('channel')
            .setDescription('Select the channel. default: <current channel>')
            .setNameLocalizations(this.getLocalizations('buttonrolesBulkCreateChannelName'))
            .setDescriptionLocalizations(this.getLocalizations('buttonrolesBulkCreateChannelDescription'))
            .addChannelTypes(...this.GuildTextChannelTypes)))
        .addSubcommand(subcommand => subcommand.setName('add')
          .setDescription('Add to a bulk of buttons in a Button role.')
          .setNameLocalizations(this.getLocalizations('buttonrolesBulkAddName'))
          .setDescriptionLocalizations(this.getLocalizations('buttonrolesBulkAddDescription'))
          .addChannelOption(option => option.setName('channel')
            .setDescription('Select the channel.')
            .setNameLocalizations(this.getLocalizations('buttonrolesBulkAddChannelName'))
            .setDescriptionLocalizations(this.getLocalizations('buttonrolesBulkAddChannelDescription'))
            .addChannelTypes(...this.GuildTextChannelTypes)
            .setRequired(true))
          .addStringOption(option => option.setName('message_id')
            .setDescription('Message ID | Message URL')
            .setNameLocalizations(this.getLocalizations('buttonrolesBulkAddMessageIdName'))
            .setDescriptionLocalizations(this.getLocalizations('buttonrolesBulkAddMessageIdDescription'))
            .setAutocomplete(true)
            .setRequired(true))
          .addStringOption(option => option.setName('roles')
            .setDescription('Input the roles.')
            .setNameLocalizations(this.getLocalizations('buttonrolesBulkAddRolesName'))
            .setDescriptionLocalizations(this.getLocalizations('buttonrolesBulkAddRolesDescription'))
            .setRequired(true)))
        .addSubcommand(subcommand => subcommand.setName('remove')
          .setDescription('Remove from a bulk of buttons in a Button role.')
          .setNameLocalizations(this.getLocalizations('buttonrolesBulkRemoveName'))
          .setDescriptionLocalizations(this.getLocalizations('buttonrolesBulkRemoveDescription'))
          .addChannelOption(option => option.setName('channel')
            .setDescription('Select the channel.')
            .setNameLocalizations(this.getLocalizations('buttonrolesBulkRemoveChannelName'))
            .setDescriptionLocalizations(this.getLocalizations('buttonrolesBulkRemoveChannelDescription'))
            .addChannelTypes(...this.GuildTextChannelTypes)
            .setRequired(true))
          .addStringOption(option => option.setName('message_id')
            .setDescription('Message ID | Message URL')
            .setNameLocalizations(this.getLocalizations('buttonrolesBulkRemoveMessageIdName'))
            .setDescriptionLocalizations(this.getLocalizations('buttonrolesBulkRemoveMessageIdDescription'))
            .setAutocomplete(true)
            .setRequired(true))
          .addStringOption(option => option.setName('roles')
            .setDescription('Input the roles.')
            .setNameLocalizations(this.getLocalizations('buttonrolesBulkRemoveRolesName'))
            .setDescriptionLocalizations(this.getLocalizations('buttonrolesBulkRemoveRolesDescription'))
            .setRequired(true))));
  }

  async execute(interaction: ChatInputCommandInteraction | AutocompleteInteraction): Promise<any> {
    if (!interaction.inCachedGuild())
      return this.replyOnlyOnServer(interaction);

    const { memberPermissions, options } = interaction;

    const userPerms = memberPermissions.missing(this.props!.userPermissions!);

    if (userPerms.length)
      return this.replyMissingPermission(interaction, userPerms, 'missingUserPermission');

    const subcommand = options.getSubcommandGroup() ?? options.getSubcommand();

    if (interaction.type === ApplicationCommandAutocomplete)
      return this.executeAutocomplete(interaction);

    await interaction.deferReply({ ephemeral: true });

    return this[subcommand]?.(interaction);
  }

  async create(interaction: ChatInputCommandInteraction<'cached'>): Promise<any> {
    const { locale, options } = interaction;

    const role = options.getRole('role', true);
    const button_emoji = options.getString('button_emoji') ?? {};
    const button_disabled = Boolean(options.getBoolean('button_disabled'));
    const button_name = (options.getString('button_name') ?? role.name).slice(0, 63);
    const button_style = options.getInteger('button_style') ?? ButtonStyle.Primary;
    const channel = <GuildTextBasedChannel>options.getChannel('channel') ?? interaction.channel;
    const [, title, description] = options.getString('text')?.match(this.regexp.embed) ?? [];

    const components = [
      new ActionRowBuilder<ButtonBuilder>()
        .setComponents([
          new ButtonBuilder()
            .setCustomId(JSON.stringify({
              c: this.data.name,
              count: 0,
              id: role.id,
            }))
            .setDisabled(button_disabled)
            .setEmoji(button_emoji)
            .setLabel(`${button_name} 0`)
            .setStyle(button_style),
        ]),
    ];

    const embeds = [
      new EmbedBuilder()
        .setColor('Random')
        .setDescription(description?.replace(/(\s{2})/g, '\n') || null)
        .setTitle(title ? title : description ? null : 'ButtonRoles'),
    ];

    try {
      await channel.send({ components, embeds });

      return interaction.editReply(this.t('?created', { locale, string: 'Button Role' }));
    } catch {
      return interaction.editReply(this.t('createError', { locale, string: 'Button Role' }));
    }
  }

  async edit(interaction: ChatInputCommandInteraction<'cached'>): Promise<any> {
    const { locale, options } = interaction;

    const channel = <GuildTextBasedChannel>options.getChannel('channel', true);
    const message_id = <string>options.getString('message_id', true).match(this.regexp.messageURL)?.[1];

    const message = await channel.messages.safeFetch(message_id);
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

        return interaction.editReply(this.t('?edited', { locale, string: 'Button Role' }));
      } catch {
        return interaction.editReply(this.t('editError', { locale, string: 'Button Role' }));
      }
    }

    if (subcommand === 'button') {
      const role = options.getRole('role');

      if (role ? this.Util.componentsHasRoles(message.components, [role]) : false)
        return interaction.editReply(this.t('editError', { locale, string: 'Button Role' }));

      const buttonId = options.getString('button', true);
      const button_disabled = options.getBoolean('button_disabled');
      const button_emoji = options.getString('button_emoji');
      const button_name = options.getString('button_name')?.slice(0, 63);
      const button_style = options.getInteger('button_style');

      const components = message.components.map(row => {
        const rowJson = <APIActionRowComponent<APIButtonComponentWithCustomId>>row.toJSON();

        if (rowJson.components[0].type !== ComponentType.Button) return row;
        if (rowJson.components.every(element => element.custom_id !== buttonId)) return row;

        return new ActionRowBuilder<ButtonBuilder>()
          .setComponents(rowJson.components.map(button => {
            const newButton = new ButtonBuilder(button);

            if (button.custom_id !== buttonId) return newButton;

            const { c, count, id, roleId } = <ButtonRolesCustomId>JSON.parse(button.custom_id);

            return newButton
              .setCustomId(JSON.stringify({ c, count, id: role?.id ?? id ?? roleId }))
              .setDisabled(Boolean(typeof button_disabled === 'boolean' ? button_disabled : button.disabled))
              .setEmoji(button_emoji ?? button.emoji ?? {})
              .setLabel(button_name ? `${button_name} ${count}` : `${button.label}`)
              .setStyle(button_style ?? button.style);
          }));
      });

      try {
        await message.edit({ components });

        return interaction.editReply(this.t('?edited', { locale, string: 'Button Role' }));
      } catch {
        return interaction.editReply(this.t('editError', { locale, string: 'Button Role' }));
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

    const subcommand = options.getSubcommand();

    if (subcommand === 'button') {
      const button_disabled = Boolean(options.getBoolean('button_disabled'));
      const button_emoji = options.getString('button_emoji') ?? {};
      const button_name = (options.getString('button_name') ?? role.name).slice(0, 63);
      const button_style = options.getInteger('button_style') ?? ButtonStyle.Primary;

      const buttons = [
        new ButtonBuilder()
          .setCustomId(JSON.stringify({
            c: this.data.name,
            count: 0,
            id: role.id,
          }))
          .setDisabled(button_disabled)
          .setEmoji(button_emoji)
          .setLabel(`${button_name} 0`)
          .setStyle(button_style),
      ];

      const components = this.Util.addButtonsToRows(message.components, buttons);

      try {
        await message.edit({ components });

        return interaction.editReply(this.t('buttonAdded', { locale }));
      } catch {
        return interaction.editReply(this.t('buttonAddError', { locale }));
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

    if (subcommand === 'button') {
      const buttonId = options.getString('button', true);

      const components = this.Util.reorganizeButtons(this.Util.removeButtonsById(message.components, buttonId));

      try {
        await message.edit({ components });

        return interaction.editReply(this.t('buttonRemoved', { locale }));
      } catch {
        return interaction.editReply(this.t('buttonRemoveError', { locale }));
      }
    }
  }

  async executeAutocomplete(interaction: AutocompleteInteraction): Promise<any> {
    if (interaction.responded) return;

    const { options } = interaction;

    const subcommand = options.getSubcommandGroup() ?? options.getSubcommand();

    const response = await this[`${subcommand}Autocomplete`]?.(interaction);

    return interaction.respond(response);
  }

  async editAutocomplete(
    interaction: AutocompleteInteraction<'cached'>,
    res: ApplicationCommandOptionChoiceData[] = [],
  ) {
    const { client, guild, options } = interaction;

    const channelId = options.get('channel')?.value;
    if (!channelId) return res;

    const channel = await guild.channels.fetch(`${channelId}`);
    if (!channel?.isTextBased()) return res;

    const focused = options.getFocused(true);
    const pattern = RegExp(`${focused.value}`, 'i');

    if (focused.name === 'message_id') {
      const messages = await channel.messages.fetch({ limit: 100 })
        .then(ms => ms.toJSON().filter(m =>
          m.author.id === client.user?.id &&
          m.components.some(c => this.CommandNameRegExp.test(c.components[0].customId!)) &&
          pattern.test(m.id)));

      for (let i = 0; i < messages.length; i++) {
        const { embeds, id } = messages[i];

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

      return res;
    }

    const message_id = options.getString('message_id', true).match(this.regexp.messageURL)?.[1];
    if (!message_id) return res;

    if (focused.name === 'button') {
      const message = await channel.messages.safeFetch(message_id);
      if (!message?.editable) return res;

      for (let i = 0; i < message.components.length; i++) {
        const component = <APIActionRowComponent<APIButtonComponent>>message.components[i].toJSON();

        if (component.components[0].type !== ComponentType.Button) continue;

        for (let j = 0; j < component.components.length; j++) {
          const button = component.components[j];

          if (button.style === ButtonStyle.Link) continue;

          const { id, roleId } = <ButtonRolesCustomId>(this.Util.JSONparse(button.custom_id) ?? {});

          const role = await guild.roles.fetch(id ?? roleId);

          const name = [
            `${i + 1} - ${j + 1}`,
            button.emoji?.id ? '' : button.emoji?.name,
            button.label ? ` | ${button.label}` : '',
            ` | ${role?.name}`,
            ` | ${id ?? roleId}`,
            ` | ${button.style}`,
            button.disabled ? ' | disabled' : '',
          ].join('').slice(0, 100);

          if (pattern.test(name))
            res.push({
              name,
              value: button.custom_id,
            });
        }
      }

      return res;
    }

    return res;
  }

  async addAutocomplete(interaction: AutocompleteInteraction<'cached'>) {
    return this.editAutocomplete(interaction);
  }

  async removeAutocomplete(interaction: AutocompleteInteraction<'cached'>) {
    return this.editAutocomplete(interaction);
  }

  async bulk(interaction: ChatInputCommandInteraction<'cached'>): Promise<any> {
    const { options } = interaction;

    const subcommand = options.getSubcommand();

    return this[`bulk_${subcommand}`]?.(interaction);
  }

  async bulk_create(interaction: ChatInputCommandInteraction<'cached'>): Promise<any> {
    const { guild, locale, options } = interaction;

    const rolesId = options.getString('roles', true).match(/\d{17,}/g)?.map(id => guild.roles.fetch(id));
    if (!rolesId) return interaction.editReply('No IDs were found in the roles input.');

    const roles = await Promise.all(rolesId).then(rs => <Role[]>rs.filter(r => r).slice(0, 25));
    if (!roles.length) return interaction.editReply('No roles were found in the roles input.');

    const components = this.Util.createButtonsByRoles({ roles });

    const channel = <GuildTextBasedChannel>options.getChannel('channel') ?? interaction.channel;

    const [, title, description] = options.getString('text')?.match(this.regexp.embed) ?? [];

    const embeds = [
      new EmbedBuilder()
        .setColor('Random')
        .setDescription(description?.replace(/(\s{2})/g, '\n') || null)
        .setTitle(title ? title : description ? null : 'ButtonRoles'),
    ];

    try {
      await channel.send({ components, embeds });

      return interaction.editReply(this.t('?created', { locale, string: 'Button Role' }));
    } catch {
      return interaction.editReply(this.t('createError', { locale, string: 'Button Role' }));
    }
  }

  async bulk_add(interaction: ChatInputCommandInteraction<'cached'>): Promise<any> {
    const { guild, locale, options } = interaction;

    const rolesId = options.getString('roles', true).match(/\d{17,}/g);
    if (!rolesId) return interaction.editReply('No IDs were found in the roles input.');

    const channel = <GuildTextBasedChannel>options.getChannel('channel', true);
    const message_id = <string>options.getString('message_id', true).match(this.regexp.messageURL)?.[1];

    const message = await channel.messages.safeFetch(message_id);
    if (!message) return interaction.editReply(this.t('message404', { locale }));
    if (!message.editable) return interaction.editReply(this.t('messageNotEditable', { locale }));

    const roles = await Promise.all(this.Util.filterRolesId(message.components, rolesId).map(id =>
      guild.roles.fetch(id))).then(rs => <Role[]>rs.filter(r => r).slice(0, 25));
    if (!roles.length) return interaction.editReply('No roles were found in the roles input.');

    const components = this.Util.addButtonsByRoles({ roles }, message.components).slice(0, 5);

    try {
      await message.edit({ components });

      return interaction.editReply(this.t('buttonAdded', { locale }));
    } catch {
      return interaction.editReply(this.t('buttonAddError', { locale }));
    }
  }

  async bulk_remove(interaction: ChatInputCommandInteraction<'cached'>): Promise<any> {
    const { locale, options } = interaction;

    const rolesId = options.getString('roles', true).match(/\d{17,}/g);
    if (!rolesId) return interaction.editReply('No IDs were found in the roles input.');

    const channel = <GuildTextBasedChannel>options.getChannel('channel', true);
    const message_id = <string>options.getString('message_id', true).match(this.regexp.messageURL)?.[1];

    const message = await channel.messages.safeFetch(message_id);
    if (!message) return interaction.editReply(this.t('message404', { locale }));
    if (!message.editable) return interaction.editReply(this.t('messageNotEditable', { locale }));

    const components = this.Util.reorganizeButtons(this.Util.removeButtonsByRoleId(message.components, rolesId));

    try {
      await message.edit({ components });

      return interaction.editReply(this.t('buttonRemoved', { locale }));
    } catch {
      return interaction.editReply(this.t('buttonRemoveError', { locale }));
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