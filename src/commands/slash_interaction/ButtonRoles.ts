import { SlashCommandBuilder } from '@discordjs/builders';
import { ApplicationCommandOptionChoiceData, AutocompleteInteraction, Client, CommandInteraction, EmojiIdentifierResolvable, MessageActionRow, MessageButton, MessageButtonStyleResolvable, MessageEmbed, Permissions, Role, TextChannel, Util } from 'discord.js';
import { ButtonRolesCustomId } from '../../@types';
import { SlashCommand } from '../../structures';

export default class ButtonRoles extends SlashCommand {
  [k: string]: any;

  constructor(client: Client) {
    super(client, {
      category: 'Moderation',
      clientPermissions: ['EMBED_LINKS', 'MANAGE_ROLES', 'SEND_MESSAGES'],
      userPermissions: ['MANAGE_ROLES'],
    });

    this.data = new SlashCommandBuilder().setName('buttonroles')
      .setDescription('Manage button roles.')
      .setDMPermission(false)
      .setDefaultMemberPermissions(Permissions.FLAGS.MANAGE_ROLES)
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
          .setDescriptionLocalizations(this.getLocalizations('buttonrolesCreateButtonNameDescription')))
        .addStringOption(option => option.setName('button_emoji')
          .setDescription('The emoji of the button.')
          .setNameLocalizations(this.getLocalizations('buttonrolesCreateButtonEmojiName'))
          .setDescriptionLocalizations(this.getLocalizations('buttonrolesCreateButtonEmojiDescription')))
        .addBooleanOption(option => option.setName('button_disabled')
          .setDescription('Whether the button is disabled.')
          .setNameLocalizations(this.getLocalizations('buttonrolesCreateButtonDisabledName'))
          .setDescriptionLocalizations(this.getLocalizations('buttonrolesCreateButtonDisabledDescription')))
        .addStringOption(option => option.setName('button_style')
          .setDescription('Select the style of the button. default: PRIMARY')
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
            .setDescription('Select a new role.'))
          .setNameLocalizations(this.getLocalizations('buttonrolesEditButtonRoleName'))
          .setDescriptionLocalizations(this.getLocalizations('buttonrolesEditButtonRoleDescription'))
          .addStringOption(option => option.setName('button_name')
            .setDescription('Input a new name. {0,63}'))
          .setNameLocalizations(this.getLocalizations('buttonrolesEditButtonButtonNameName'))
          .setDescriptionLocalizations(this.getLocalizations('buttonrolesEditButtonButtonNameDescription'))
          .addStringOption(option => option.setName('button_style')
            .setDescription('Select a new style.')
            .setNameLocalizations(this.getLocalizations('buttonrolesEditButtonButtonStyleName'))
            .setDescriptionLocalizations(this.getLocalizations('buttonrolesEditButtonButtonStyleDescription'))
            .setChoices(...this.ButtonStylesChoices))
          .addStringOption(option => option.setName('button_emoji')
            .setDescription('Input a new emoji.'))
          .setNameLocalizations(this.getLocalizations('buttonrolesEditButtonButtonEmojiName'))
          .setDescriptionLocalizations(this.getLocalizations('buttonrolesEditButtonButtonEmojiDescription'))
          .addBooleanOption(option => option.setName('button_disabled')
            .setDescription('Whether the button is disabled.')
            .setDescriptionLocalizations(this.getLocalizations('buttonrolesEditButtonButtonDisabledDescription'))
            .setNameLocalizations(this.getLocalizations('buttonrolesEditButtonButtonDisabledName')))))
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
            .setDescriptionLocalizations(this.getLocalizations('buttonrolesAddButtonButtonNameDescription')))
          .addStringOption(option => option.setName('button_style')
            .setDescription('Select the style of the button. default: PRIMARY')
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

  async execute(interaction: CommandInteraction | AutocompleteInteraction): Promise<any> {
    const { locale } = interaction;

    if (!interaction.inCachedGuild()) {
      if (interaction.isAutocomplete()) return interaction.respond([]);

      return interaction.reply(this.t('onlyOnServer', { locale }));
    }

    const { memberPermissions, options } = interaction;

    const userPerms = memberPermissions.missing(this.props!.userPermissions!);

    if (userPerms.length) {
      if (interaction.isAutocomplete()) return interaction.respond([]);

      return interaction.reply({
        content: this.t('missingUserPermission', {
          locale,
          permission: this.t(userPerms[0], { locale }),
        }),
        ephemeral: true,
      });
    }

    const subcommand = options.getSubcommandGroup(false) ?? options.getSubcommand();

    if (interaction.isAutocomplete())
      return this[`${subcommand}Autocomplete`]?.(interaction);

    await interaction.deferReply({ ephemeral: true });

    return this[subcommand]?.(interaction);
  }

  async create(interaction: CommandInteraction): Promise<any> {
    const { locale, options } = interaction;

    const [, title, description] = options.getString('text')?.match(this.pattern.embed) ?? [];
    const button_emoji = options.getString('button_emoji');
    const button_disabled = <boolean>options.getBoolean('button_disabled');
    const button_style = <MessageButtonStyleResolvable>options.getString('button_style') || 'PRIMARY';
    const channel = <TextChannel>options.getChannel('channel') ?? interaction.channel;
    const role = options.getRole('role', true);
    const button_name = (options.getString('button_name') ?? role.name).slice(0, 63);

    const emoji = <EmojiIdentifierResolvable>(button_emoji ? Util.resolvePartialEmoji(button_emoji) : null);

    const buttons = [
      new MessageButton()
        .setCustomId(JSON.stringify({
          c: this.data.name,
          count: 0,
          roleId: role.id,
        }))
        .setDisabled(button_disabled)
        .setEmoji(emoji)
        .setLabel([button_name, ' 0'].join(''))
        .setStyle(button_style),
    ];

    const components = [new MessageActionRow().setComponents(buttons)];

    const embeds = [
      new MessageEmbed()
        .setColor('RANDOM')
        .setDescription(description ? description.replace(/(\s{2})/g, '\n') : '')
        .setTitle(title ? title : description ? '' : 'ButtonRoles'),
    ];

    try {
      await channel.send({ components, embeds });

      return interaction.editReply(this.t('?created', { locale, string: 'Button Role' }));
    } catch {
      return interaction.editReply(this.t('createError', { locale, string: 'Button Role' }));
    }
  }

  async edit(interaction: CommandInteraction): Promise<any> {
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
        new MessageEmbed()
          .setColor('RANDOM')
          .setDescription(description ? description.replace(/(\s{2})/g, '\n') : '')
          .setTitle(title || ''),
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

      if (role ? message.components.some(row => row.components.some(element => {
        if (element.type === 'BUTTON')
          return JSON.parse(`${element.customId}`).roleId === role.id;

        return element.options.some(option => JSON.parse(`${option.value}`).roleId === role?.id);
      })) : false) return interaction.editReply(this.t('itemAddError', { locale }));

      const button_disabled = options.getBoolean('button_disabled');
      const button_emoji = options.getString('button_emoji');
      const button_name = options.getString('button_name')?.slice(0, 63);
      const button_style = options.getString('button_style');
      const buttonId = options.getString('button', true);

      const emoji = button_emoji ? Util.resolvePartialEmoji(button_emoji) : null;

      message.components.map(row => {
        if (row.components[0].type !== 'BUTTON') return row;

        row.components.map(button => {
          if (button.customId !== buttonId || button.type !== 'BUTTON') return button;

          const { c, count, d, roleId } = <ButtonRolesCustomId>JSON.parse(button.customId);

          button.setCustomId(JSON.stringify({ c, count, d, roleId: role?.id ?? roleId }))
            .setDisabled(typeof button_disabled === 'boolean' ? button_disabled : button.disabled)
            .setEmoji(<EmojiIdentifierResolvable>emoji ?? button.emoji)
            .setLabel(button_name ? `${button_name} ${count}` : `${button.label}`)
            .setStyle(<MessageButtonStyleResolvable>button_style ?? button.style);

          return button;
        });

        return row;
      });

      try {
        await message.edit({ components: message.components });

        return interaction.editReply(this.t('?edited', { locale, string: 'Button Role' }));
      } catch {
        return interaction.editReply(this.t('editError', { locale, string: 'Button Role' }));
      }
    }
  }

  async add(interaction: CommandInteraction): Promise<any> {
    const { locale, options } = interaction;

    const channel = <TextChannel>options.getChannel('channel', true);
    const message_id = <string>options.getString('message_id', true).match(this.pattern.messageURL)?.[1];

    const message = await channel.messages.fetch(message_id);

    if (!message) return interaction.editReply(this.t('message404', { locale }));

    if (!message.editable) return interaction.editReply(this.t('messageNotEditable', { locale }));

    const role = options.getRole('role', true);

    if (message.components.some(row => row.components.some(element => {
      if (element.type === 'BUTTON')
        return JSON.parse(`${element.customId}`).roleId === role?.id;

      return element.options.some(option => JSON.parse(`${option.value}`).roleId === role?.id);
    }))) return interaction.editReply(this.t('itemAddError', { locale }));

    const subcommand = options.getSubcommand();

    if (subcommand === 'button') {
      const button_disabled = <boolean>options.getBoolean('button_disabled');
      const button_emoji = options.getString('button_emoji');
      const button_name = (options.getString('button_name') ?? role.name).slice(0, 63);
      const button_style = <MessageButtonStyleResolvable>options.getString('button_style') || 'PRIMARY';

      const emoji = <EmojiIdentifierResolvable>(button_emoji ? Util.resolvePartialEmoji(button_emoji) : null);

      const buttons = [
        new MessageButton()
          .setCustomId(JSON.stringify({
            c: this.data.name,
            count: 0,
            roleId: role.id,
          }))
          .setDisabled(button_disabled)
          .setEmoji(emoji)
          .setLabel([button_name, ' 0'].join(''))
          .setStyle(button_style),
      ];

      const buttonsLength = message.components.length ?
        message.components.reduce((acc: number[], row) => [
          ...acc,
          row.components[0].type === 'BUTTON' ? row.components.length : 0,
        ], []) : [];

      if (!buttonsLength.length || buttonsLength.every(v => v === 5)) {
        message.components.push(new MessageActionRow().setComponents(buttons));
      } else {
        let index = 0;

        message.components.map(row => {
          if (row.components[0].type !== 'BUTTON' || row.components.length === 5 || index) return row;

          row.addComponents(buttons);

          index++;

          return row;
        });
      }

      try {
        await message.edit({ components: message.components });

        return interaction.editReply(this.t('buttonAdded', { locale }));
      } catch {
        return interaction.editReply(this.t('buttonAddError', { locale }));
      }
    }
  }

  async remove(interaction: CommandInteraction): Promise<any> {
    const { locale, options } = interaction;

    const channel = <TextChannel>options.getChannel('channel', true);
    const message_id = <string>options.getString('message_id', true).match(this.pattern.messageURL)?.[1];

    const message = await channel.messages.fetch(message_id);

    if (!message) return interaction.editReply(this.t('message404', { locale }));

    if (!message.editable) return interaction.editReply(this.t('messageNotEditable', { locale }));

    const subcommand = options.getSubcommand();

    if (subcommand === 'button') {
      const buttonId = options.getString('button', true);

      message.components.map(row => {
        if (row.components[0].type !== 'BUTTON') return row;

        row.components = row.components.filter(button => button.customId !== buttonId);

        return row;
      }).filter(row => row.components.length);

      try {
        await message.edit({ components: message.components });

        return interaction.editReply(this.t('buttonRemoved', { locale }));
      } catch {
        return interaction.editReply(this.t('buttonRemoveError', { locale }));
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

    if (focused.name === 'button') {
      const message_id = <string>options.getString('message_id', true).match(this.pattern.messageURL)?.[1];

      const message = await channel.messages.fetch(message_id);

      if (!(message && message.editable)) return interaction.respond(res);

      for (let i = 0; i < message.components.length; i++) {
        const component = message.components[i];

        if (component.components[0].type !== 'BUTTON') continue;

        for (let i2 = 0; i2 < component.components.length; i2++) {
          const button = <MessageButton>component.components[i2];

          const { customId, disabled, emoji, label, style } = button;

          const { roleId } = <ButtonRolesCustomId>JSON.parse(customId!);

          const role = await guild.roles.fetch(roleId);

          const name = [
            `${i + 1} - ${i2 + 1}`,
            emoji?.id ? '' : emoji?.name,
            label ? ` | ${label}` : '',
            ` | ${role?.name}`,
            ` | ${roleId}`,
            ` | ${style}`,
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

    return interaction.respond(res);
  }

  async addAutocomplete(interaction: AutocompleteInteraction<'cached'>) {
    return this.editAutocomplete(interaction);
  }

  async removeAutocomplete(interaction: AutocompleteInteraction<'cached'>) {
    return this.editAutocomplete(interaction);
  }

  async bulk(interaction: CommandInteraction): Promise<any> {
    const { options } = interaction;

    const subcommand = options.getSubcommand();

    return this[`bulk_${subcommand}`]?.(interaction);
  }

  async bulk_create(interaction: CommandInteraction<'cached'>): Promise<any> {
    const { guild, locale, options } = interaction;

    const rolesId = options.getString('roles', true).match(/\d{17,}/g)
      ?.map(id => guild.roles.fetch(id));

    if (!rolesId)
      return interaction.editReply('No IDs were found in the roles input.');

    const rolesArray = await Promise.all(rolesId)
      .then(roles => <Role[]>roles.filter(role => role));

    if (!rolesArray.length)
      return interaction.editReply('No roles were found in the roles input.');

    const rolesGroups = this.Util.splitArrayInGroups(rolesArray.slice(0, 25), 5);

    const components = this.Util.createButtonRoles(rolesGroups);

    const channel = <TextChannel>options.getChannel('channel') ?? interaction.channel;

    const [, title, description] = options.getString('text')?.match(this.pattern.embed) ?? [];

    const embeds = [
      new MessageEmbed()
        .setColor('RANDOM')
        .setDescription(description ? description.replace(/(\s{2})/g, '\n') : '')
        .setTitle(title ? title : description ? '' : 'ButtonRoles'),
    ];

    try {
      await channel.send({ components, embeds });

      return interaction.editReply(this.t('?created', { locale, string: 'Button Role' }));
    } catch {
      return interaction.editReply(this.t('createError', { locale, string: 'Button Role' }));
    }
  }

  async bulk_add(interaction: CommandInteraction<'cached'>): Promise<any> {
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
      .then(roles => <Role[]>roles.filter(role => role));

    if (!rolesArray.length)
      return interaction.editReply('No roles were found in the roles input.');

    message.components = this.Util.addButtonRoles(rolesArray, message.components).slice(0, 5);

    try {
      await message.edit({ components: message.components });

      return interaction.editReply(this.t('buttonAdded', { locale }));
    } catch {
      return interaction.editReply(this.t('buttonAddError', { locale }));
    }
  }

  async bulk_remove(interaction: CommandInteraction<'cached'>): Promise<any> {
    const { locale, options } = interaction;

    const rolesId = options.getString('roles', true).match(/\d{17,}/g);

    if (!rolesId)
      return interaction.editReply('No IDs were found in the roles input.');

    const channel = <TextChannel>options.getChannel('channel', true);
    const message_id = <string>options.getString('message_id', true).match(this.pattern.messageURL)?.[1];

    const message = await channel.messages.fetch(message_id);

    if (!message) return interaction.editReply(this.t('message404', { locale }));

    if (!message.editable) return interaction.editReply(this.t('messageNotEditable', { locale }));

    message.components = this.Util.removeButtonRoles(rolesId, message.components);

    try {
      await message.edit({ components: message.components });

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