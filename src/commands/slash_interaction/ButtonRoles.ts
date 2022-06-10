import { SlashCommandBuilder } from '@discordjs/builders';
import { ApplicationCommandOptionChoiceData, AutocompleteInteraction, Client, CommandInteraction, EmojiIdentifierResolvable, MessageActionRow, MessageButton, MessageButtonStyleResolvable, MessageEmbed, Permissions, TextChannel, Util } from 'discord.js';
import { ButtonRolesCustomId } from '../../@types';
import { SlashCommand } from '../../structures';

export default class ButtonRoles extends SlashCommand {
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
      .addSubcommand(subcommand => subcommand.setName('setup')
        .setDescription('Create a button role.')
        .setNameLocalizations(this.getLocalizations('buttonrolesSetupName'))
        .setDescriptionLocalizations(this.getLocalizations('buttonrolesSetupDescription'))
        .addRoleOption(option => option.setName('role')
          .setDescription('Select the role to use.')
          .setNameLocalizations(this.getLocalizations('buttonrolesSetupRoleName'))
          .setDescriptionLocalizations(this.getLocalizations('buttonrolesSetupRoleDescription'))
          .setRequired(true))
        .addStringOption(option => option.setName('text')
          .setDescription('The text of the button. Title {0,256} | Description {0,4096} - default: ButtonRoles')
          .setNameLocalizations(this.getLocalizations('buttonrolesSetupTextName'))
          .setDescriptionLocalizations(this.getLocalizations('buttonrolesSetupTextDescription')))
        .addStringOption(option => option.setName('button_name')
          .setDescription('The name of the button. Button name {0,63} - default: <role>')
          .setNameLocalizations(this.getLocalizations('buttonrolesSetupButtonNameName'))
          .setDescriptionLocalizations(this.getLocalizations('buttonrolesSetupButtonNameDescription')))
        .addStringOption(option => option.setName('button_emoji')
          .setDescription('The emoji of the button.')
          .setNameLocalizations(this.getLocalizations('buttonrolesSetupButtonEmojiName'))
          .setDescriptionLocalizations(this.getLocalizations('buttonrolesSetupButtonEmojiDescription')))
        .addBooleanOption(option => option.setName('button_disabled')
          .setDescription('Whether the button is disabled.')
          .setNameLocalizations(this.getLocalizations('buttonrolesSetupButtonDisabledName'))
          .setDescriptionLocalizations(this.getLocalizations('buttonrolesSetupButtonDisabledDescription')))
        .addStringOption(option => option.setName('button_style')
          .setDescription('Select the style of the button. default: PRIMARY')
          .setNameLocalizations(this.getLocalizations('buttonrolesSetupButtonStyleName'))
          .setDescriptionLocalizations(this.getLocalizations('buttonrolesSetupButtonStyleDescription'))
          .setChoices(...this.ButtonStylesChoices))
        .addChannelOption(option => option.setName('channel')
          .setDescription('Select the channel. default: <current channel>')
          .setNameLocalizations(this.getLocalizations('buttonrolesSetupChannelName'))
          .setDescriptionLocalizations(this.getLocalizations('buttonrolesSetupChannelDescription'))
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
            .setRequired(true))));
  }

  async execute(interaction: CommandInteraction | AutocompleteInteraction) {
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
        content: this.t('missingUserPermission', {
          locale,
          permission: this.t(userPerms[0], { locale }),
        }),
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

      return await interaction.editReply(this.t('?created', { locale, string: 'Button Role' }));
    } catch {
      return await interaction.editReply(this.t('createError', { locale, string: 'Button Role' }));
    }
  }

  async edit(interaction: CommandInteraction) {
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

        return await interaction.editReply(this.t('?edited', { locale, string: 'Button Role' }));
      } catch {
        return await interaction.editReply(this.t('editError', { locale, string: 'Button Role' }));
      }
    }

    if (subcommand === 'button') {
      const role = options.getRole('role');

      if (role ? message.components.some(row => row.components.some(element => {
        if (element.type === 'BUTTON')
          return JSON.parse(`${element.customId}`).roleId === role.id;

        return element.options.some(option => JSON.parse(`${option.value}`).roleId === role?.id);
      })) : false) return await interaction.editReply(this.t('itemAddError', { locale }));

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

        return await interaction.editReply(this.t('?edited', { locale, string: 'Button Role' }));
      } catch {
        return await interaction.editReply(this.t('editError', { locale, string: 'Button Role' }));
      }
    }
  }

  async add(interaction: CommandInteraction) {
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

        return await interaction.editReply(this.t('buttonAdded', { locale }));
      } catch {
        return await interaction.editReply(this.t('buttonAddError', { locale }));
      }
    }
  }

  async remove(interaction: CommandInteraction) {
    const { locale, options } = interaction;

    const channel = <TextChannel>options.getChannel('channel', true);
    const message_id = <string>options.getString('message_id', true).match(this.pattern.messageURL)?.[1];

    const message = await channel.messages.fetch(message_id);

    if (!message) return await interaction.editReply(this.t('message404', { locale }));

    if (!message.editable) return await interaction.editReply(this.t('messageNotEditable', { locale }));

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

        return await interaction.editReply(this.t('buttonRemoved', { locale }));
      } catch {
        return await interaction.editReply(this.t('buttonRemoveError', { locale }));
      }
    }
  }

  async editAutocomplete(interaction: AutocompleteInteraction, res: ApplicationCommandOptionChoiceData[] = []) {
    if (interaction.responded) return;

    const { client, guild, options } = interaction;

    const channelId = <string>options.get('channel', true).value;

    const channel = await guild?.channels.fetch(channelId);

    if (!(channel instanceof TextChannel))
      return await interaction.respond(res);

    const focused = options.getFocused(true);
    const pattern = RegExp(`${focused.value}`, 'i');

    if (focused.name === 'message_id') {
      const messages = await channel.messages.fetch({ limit: 100 });

      const messages_array = messages.filter(m =>
        m.author.id === client.user?.id &&
        m.components.some(c => RegExp(`"c":"${this.data.name}"`).test(c.components[0].customId!)) &&
        pattern.test(m.id)).toJSON();

      for (let i = 0; i < messages_array.length; i++) {
        const { embeds, id } = messages_array[i];

        const { title, description } = embeds[0];

        const nameProps = [
          id,
          title ? ` | ${title}` : '',
          description ? ` | ${description}` : '',
        ];

        if (title || description)
          res.push({
            name: `${nameProps.join('').slice(0, 80)}`,
            value: `${id}`,
          });

        if (res.length === 25) break;
      }
    }

    if (focused.name === 'button') {
      const message_id = <string>options.getString('message_id', true).match(this.pattern.messageURL)?.[1];

      const message = await channel.messages.fetch(message_id);

      if (!message) return await interaction.respond(res);

      if (!message.editable) return await interaction.respond(res);

      for (let i = 0; i < message.components.length; i++) {
        const component = message.components[i];

        if (component.components[0].type !== 'BUTTON') continue;

        for (let i2 = 0; i2 < component.components.length; i2++) {
          const button = <MessageButton>component.components[i2];

          const { customId, disabled, label, style } = button;

          const { roleId } = <ButtonRolesCustomId>JSON.parse(<string>customId);

          const role = await guild?.roles.fetch(roleId);

          const nameProps = [
            `${i + 1} - ${i2 + 1}`,
            label ? ` | ${label}` : '',
            ` | ${role?.name}`,
            ` | ${roleId}`,
            ` | ${style}`,
            disabled ? ' | disabled' : '',
          ];

          const name = nameProps.join('');

          if (pattern.test(name))
            res.push({
              name: `${name.slice(0, 80)}`,
              value: `${customId}`,
            });
        }
      }
    }

    await interaction.respond(res);
  }

  async addAutocomplete(interaction: AutocompleteInteraction) {
    await this.editAutocomplete(interaction);
  }

  async removeAutocomplete(interaction: AutocompleteInteraction) {
    await this.editAutocomplete(interaction);
  }
}