import { SlashCommandBuilder } from '@discordjs/builders';
import { ApplicationCommandOptionChoice, AutocompleteInteraction, CommandInteraction, EmojiIdentifierResolvable, MessageActionRow, MessageButton, MessageButtonStyleResolvable, MessageEmbed, PermissionString, TextChannel, Util } from 'discord.js';
import { Client, SlashCommand } from '../../structures';

export interface ButtonRolesCustomId {
  /** command */
  c: string
  count: number
  /** date */
  d: number
  roleId: string
}

export default class ButtonRoles extends SlashCommand {
  constructor(client: Client) {
    super(client, {
      clientPermissions: ['EMBED_LINKS', 'MANAGE_ROLES', 'SEND_MESSAGES'],
      userPermissions: ['MANAGE_ROLES'],
    });

    this.data = new SlashCommandBuilder().setName('buttonroles')
      .setDescription('Button roles.')
      .addSubcommand(subcommand => subcommand.setName('setup')
        .setDescription('New Button role.')
        .addRoleOption(option => option.setName('role')
          .setDescription('Role')
          .setRequired(true))
        .addStringOption(option => option.setName('text')
          .setDescription('Text: Title {0,256} | Description {0,4096} - default: ButtonRoles'))
        .addStringOption(option => option.setName('button_name')
          .setDescription('Button name {0,84} - default: <role>'))
        .addStringOption(option => option.setName('button_emoji')
          .setDescription('Button emoji'))
        .addBooleanOption(option => option.setName('button_disabled')
          .setDescription('Set disabled - default: false'))
        .addStringOption(option => option.setName('button_style')
          .setDescription('Button style - default: PRIMARY')
          .setChoices(this.ButtonStylesChoices))
        .addChannelOption(option => option.setName('channel')
          .setDescription('Channel - default: <current channel>')
          .addChannelTypes(this.GuildTextChannelTypes as any)))
      .addSubcommandGroup(subcommandgroup => subcommandgroup.setName('edit')
        .setDescription('Edit a Button role.')
        .addSubcommand(subcommand => subcommand.setName('message')
          .setDescription('Edit a text in a Button role.')
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
        .addSubcommand(subcommand => subcommand.setName('button')
          .setDescription('Edit a button in a Button role.')
          .addChannelOption(option => option.setName('channel')
            .setDescription('Channel')
            .setRequired(true)
            .addChannelTypes(this.GuildTextChannelTypes as any))
          .addStringOption(option => option.setName('message_id')
            .setDescription('Message ID | Message URL')
            .setAutocomplete(true)
            .setRequired(true))
          .addStringOption(option => option.setName('button')
            .setDescription('Button')
            .setAutocomplete(true)
            .setRequired(true))
          .addRoleOption(option => option.setName('role')
            .setDescription('Role'))
          .addStringOption(option => option.setName('button_name')
            .setDescription('Button name {0,84}'))
          .addStringOption(option => option.setName('button_style')
            .setDescription('Button style')
            .setChoices(this.ButtonStylesChoices))
          .addStringOption(option => option.setName('button_emoji')
            .setDescription('Button emoji'))
          .addBooleanOption(option => option.setName('button_disabled')
            .setDescription('Set disabled'))))
      .addSubcommandGroup(subcommandgroup => subcommandgroup.setName('add')
        .setDescription('Add to Button role.')
        .addSubcommand(subcommand => subcommand.setName('button')
          .setDescription('Add a new button in a Button role')
          .addChannelOption(option => option.setName('channel')
            .setDescription('Channel')
            .setRequired(true)
            .addChannelTypes(this.GuildTextChannelTypes as any))
          .addStringOption(option => option.setName('message_id')
            .setDescription('Message ID | Message URL')
            .setAutocomplete(true)
            .setRequired(true))
          .addRoleOption(option => option.setName('role')
            .setDescription('Role')
            .setRequired(true))
          .addStringOption(option => option.setName('button_name')
            .setDescription('Button name {0,84} - default: <role>'))
          .addStringOption(option => option.setName('button_style')
            .setDescription('Button style - default: PRIMARY')
            .setChoices(this.ButtonStylesChoices))
          .addStringOption(option => option.setName('button_emoji')
            .setDescription('Button emoji'))
          .addBooleanOption(option => option.setName('button_disabled')
            .setDescription('Set disabled - default: false'))))
      .addSubcommandGroup(subcommandgroup => subcommandgroup.setName('remove')
        .setDescription('Remove from a Button role.')
        .addSubcommand(subcommand => subcommand.setName('button')
          .setDescription('Remove a button from a Button role')
          .addChannelOption(option => option.setName('channel')
            .setDescription('Channel')
            .setRequired(true)
            .addChannelTypes(this.GuildTextChannelTypes as any))
          .addStringOption(option => option.setName('message_id')
            .setDescription('Message ID | Message URL')
            .setAutocomplete(true)
            .setRequired(true))
          .addStringOption(option => option.setName('button')
            .setDescription('Button')
            .setAutocomplete(true)
            .setRequired(true))));
  }

  async execute(interaction: CommandInteraction | AutocompleteInteraction): Promise<any> {
    const { locale, memberPermissions, options } = interaction;

    if (!interaction.inCachedGuild()) {
      if (interaction.isAutocomplete()) return await interaction.respond([]);

      return await interaction.editReply(this.t('onlyOnServer', { locale }));
    }

    const userPermissions = memberPermissions?.missing(this.props?.userPermissions as PermissionString[]) || [];

    if (userPermissions.length) {
      if (interaction.isAutocomplete()) return await interaction.respond([]);

      return await interaction.reply({
        content: this.t('missingUserPermission', { locale, PERMISSIONS: userPermissions }),
        ephemeral: true,
      });
    }

    const subcommand = (options.getSubcommandGroup(false) || options.getSubcommand()) as 'edit';

    if (interaction.isAutocomplete())
      return await this[`${subcommand}Autocomplete`]?.(interaction);

    await interaction.deferReply({ ephemeral: true });

    await this[subcommand]?.(interaction);
  }

  async setup(interaction: CommandInteraction): Promise<any> {
    const { locale, options } = interaction;

    const [, title, description] = options.getString('text')?.match(this.pattern.embed) || [];
    const button_emoji = options.getString('button_emoji');
    const button_disabled = options.getBoolean('button_disabled') as boolean;
    const button_style = (options.getString('button_style') || 'PRIMARY') as MessageButtonStyleResolvable;
    const channel = (options.getChannel('channel') || interaction.channel) as TextChannel;
    const role = options.getRole('role', true);
    const button_name = options.getString('button_name')?.match(this.pattern.labelLimited)?.[1] || role.name;

    const emoji = (button_emoji ? Util.resolvePartialEmoji(button_emoji) : null) as EmojiIdentifierResolvable;

    const button = new MessageButton()
      .setCustomId(JSON.stringify({
        c: this.data.name,
        count: 0,
        d: Date.now(),
        roleId: role.id,
      }))
      .setDisabled(button_disabled)
      .setEmoji(emoji)
      .setLabel([button_name, ' 0'].join(''))
      .setStyle(button_style);

    const components = [new MessageActionRow().setComponents([button])];

    const embeds = [new MessageEmbed()
      .setColor('RANDOM')
      .setDescription(description ? description?.replace(/(\s{2})/g, '\n') : '')
      .setTitle(title ? title : description ? '' : 'ButtonRoles')];

    try {
      await channel.send({ components, embeds });

      return await interaction.editReply(this.t('?created', { locale, string: 'Button Role' }));
    } catch {
      return await interaction.editReply(this.t('createError', { locale, string: 'Button Role' }));
    }
  }

  async edit(interaction: CommandInteraction): Promise<any> {
    const { locale, options } = interaction;

    const channel = options.getChannel('channel', true) as TextChannel;
    const message_id = options.getString('message_id', true).match(this.pattern.messageURL)?.[1] as string;

    const message = await channel.messages.fetch(message_id);

    if (!message) return await interaction.editReply(this.t('message404', { locale }));

    if (!message.editable) return await interaction.editReply(this.t('messageNotEditable', { locale }));

    const subcommand = options.getSubcommand();

    if (subcommand === 'message') {
      const [, title, description] = options.getString('text', true).match(this.pattern.embed) || [];

      const embeds = [new MessageEmbed()
        .setColor('RANDOM')
        .setDescription(description ? description.replace(/(\s{2})/g, '\n') : '')
        .setTitle(title || '')];

      try {
        await message.edit({ embeds });

        return await interaction.editReply(this.t('?edited', { locale, string: 'Button Role' }));
      } catch {
        return await interaction.editReply(this.t('editError', { locale, string: 'Button Role' }));
      }
    }

    if (subcommand === 'button') {
      const button_disabled = options.getBoolean('button_disabled');
      const button_emoji = options.getString('button_emoji');
      const button_name = options.getString('button_name')?.match(this.pattern.labelLimited)?.[1];
      const button_style = options.getString('button_style');
      const buttonId = options.getString('button', true);
      const role = options.getRole('role');

      const emoji = button_emoji ? Util.resolvePartialEmoji(button_emoji) : null;

      const components = message.components.map(row => {
        if (row.components[0].type !== 'BUTTON') return row;

        row.components = row.components.map(button => {
          if (button.customId !== buttonId || button.type !== 'BUTTON') return button;

          const { c, count, d, roleId } = JSON.parse(button.customId) as ButtonRolesCustomId;

          button.setCustomId(JSON.stringify({ c, count, d, roleId: role?.id || roleId }))
            .setDisabled(typeof button_disabled === 'boolean' ? button_disabled : button.disabled)
            .setEmoji((emoji || button.emoji) as EmojiIdentifierResolvable)
            .setLabel(button_name ? `${button_name} ${count}` : `${button.label}`)
            .setStyle((button_style || button.style) as MessageButtonStyleResolvable);

          return button;
        });

        return row;
      });

      try {
        await message.edit({ components });

        return await interaction.editReply(this.t('?edited', { locale, string: 'Button Role' }));
      } catch {
        return await interaction.editReply(this.t('editError', { locale, string: 'Button Role' }));
      }
    }
  }

  async add(interaction: CommandInteraction): Promise<any> {
    const { locale, options } = interaction;

    const channel = options.getChannel('channel', true) as TextChannel;
    const message_id = options.getString('message_id', true).match(this.pattern.messageURL)?.[1] as string;

    const message = await channel.messages.fetch(message_id);

    if (!message) return await interaction.editReply(this.t('message404', { locale }));

    if (!message.editable) return await interaction.editReply(this.t('messageNotEditable', { locale }));

    const subcommand = options.getSubcommand();

    if (subcommand === 'button') {
      const button_style = (options.getString('button_style') || 'PRIMARY') as MessageButtonStyleResolvable;
      const button_emoji = options.getString('button_emoji');
      const button_disabled = options.getBoolean('button_disabled') as boolean;
      const role = options.getRole('role', true);
      const button_name = options.getString('button_name')?.match(this.pattern.labelLimited)?.[1] || role.name;

      const emoji = (button_emoji ? Util.resolvePartialEmoji(button_emoji) : null) as EmojiIdentifierResolvable;

      const button = new MessageButton()
        .setCustomId(JSON.stringify({
          c: this.data.name,
          count: 0,
          d: Date.now(),
          roleId: role?.id,
        }))
        .setDisabled(button_disabled)
        .setEmoji(emoji)
        .setLabel([button_name, ' 0'].join(''))
        .setStyle(button_style);

      const components = message.components.map(row => {
        if (row.components[0].type !== 'BUTTON') return row;

        row.addComponents(button);

        return row;
      });
      try {
        await message.edit({ components });

        return await interaction.editReply(this.t('buttonAdded', { locale }));
      } catch {
        return await interaction.editReply(this.t('buttonAddError', { locale }));
      }
    }
  }

  async remove(interaction: CommandInteraction): Promise<any> {
    const { locale, options } = interaction;

    const channel = options.getChannel('channel', true) as TextChannel;
    const message_id = options.getString('message_id', true).match(this.pattern.messageURL)?.[1] as string;

    const message = await channel.messages.fetch(message_id);

    if (!message) return await interaction.editReply(this.t('message404', { locale }));

    if (!message.editable) return await interaction.editReply(this.t('messageNotEditable', { locale }));

    const subcommand = options.getSubcommand();

    if (subcommand === 'button') {
      const buttonId = options.getString('button', true);

      const components = message.components.map(row => {
        if (row.components[0].type !== 'BUTTON') return row;

        row.components = row.components.filter(button => button.customId !== buttonId);

        return row;
      });

      try {
        await message.edit({ components });

        return await interaction.editReply(this.t('buttonRemoved', { locale }));
      } catch {
        return await interaction.editReply(this.t('buttonRemoveError', { locale }));
      }
    }
  }

  async editAutocomplete(interaction: AutocompleteInteraction, res: ApplicationCommandOptionChoice[] = []) {
    if (interaction.responded) return;

    const { client, guild, options } = interaction;

    const channelId = options.get('channel', true).value as string;

    const channel = await guild?.channels.fetch(channelId) as TextChannel;

    const focused = options.getFocused(true);
    const pattern = RegExp(`${focused.value}`, 'i');

    if (focused.name === 'message_id') {
      const messages = await channel.messages.fetch();

      const messages_array = messages.filter(m =>
        m.author.id === client.user?.id &&
        m.components.some(c => RegExp(`"c":"${this.data.name}"`).test(c.components[0].customId as string)) &&
        pattern.test(m.id)).toJSON();

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
            name: `${nameProps.join(' ').trim().match(this.pattern.label)?.[1]}`,
            value: `${id}`,
          });

        if (res.length === 25) break;
      }
    }

    if (focused.name === 'button') {
      const message_id = options.getString('message_id', true);

      const message = await channel.messages.fetch(message_id);

      if (!message) return await interaction.respond([]);

      if (!message.editable) return await interaction.respond([]);

      for (let i = 0; i < message.components.length; i++) {
        const component = message.components[i];

        if (component.components[0].type !== 'BUTTON') continue;

        for (let i2 = 0; i2 < component.components.length; i2++) {
          const button = component.components[i2] as MessageButton;

          const { customId, disabled, label, style } = button;

          const { roleId } = JSON.parse(customId as string) as ButtonRolesCustomId;

          const role = await guild?.roles.fetch(roleId);

          const nameProps = [
            `${i2 + 1}`,
            label ? `| ${label}` : '',
            `| ${role?.name}`,
            `| ${roleId}`,
            `| ${style}`,
            disabled ? '| disabled' : '',
          ];

          const name = nameProps.join(' ').trim();

          if (pattern.test(name))
            res.push({
              name: `${name.match(this.pattern.label)?.[1]}`,
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