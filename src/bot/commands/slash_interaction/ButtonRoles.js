const { SlashCommand } = require('../../classes');
const { MessageButton, MessageActionRow, MessageEmbed, Util } = require('discord.js');


module.exports = class extends SlashCommand {
  constructor(client) {
    super(client, {
      clientPermissions: ['EMBED_LINKS', 'MANAGE_ROLES', 'SEND_MESSAGES'],
      userPermissions: ['MANAGE_ROLES'],
    });
    this.data = this.setName('buttonroles')
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
          .addChannelTypes(this.GuildTextChannelTypes)))
      .addSubcommandGroup(subcommandgroup => subcommandgroup.setName('edit')
        .setDescription('Edit a Button role.')
        .addSubcommand(subcommand => subcommand.setName('message')
          .setDescription('Edit a text in a Button role.')
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
        .addSubcommand(subcommand => subcommand.setName('button')
          .setDescription('Edit a button in a Button role.')
          .addChannelOption(option => option.setName('channel')
            .setDescription('Channel')
            .setRequired(true)
            .addChannelTypes(this.GuildTextChannelTypes))
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
            .addChannelTypes(this.GuildTextChannelTypes))
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
            .addChannelTypes(this.GuildTextChannelTypes))
          .addStringOption(option => option.setName('message_id')
            .setDescription('Message ID | Message URL')
            .setAutocomplete(true)
            .setRequired(true))
          .addStringOption(option => option.setName('button')
            .setDescription('Button')
            .setAutocomplete(true)
            .setRequired(true))));
  }

  async execute(interaction = this.CommandInteraction) {
    const { locale, memberPermissions, options } = interaction;

    if (!interaction.inGuild())
      return await interaction.reply({ content: this.t('onlyOnServer', { locale }), ephemeral: true });

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

    const [, title, description] = options.getString('text')?.match(this.regexp.embed) || [];
    const button_style = options.getString('button_style') || 'PRIMARY';
    const button_emoji = options.getString('button_emoji');
    const button_disabled = options.getBoolean('button_disabled');
    const channel = options.getChannel('channel') || interaction.channel;
    const role = options.getRole('role');
    const button_name = options.getString('button_name')?.match(this.regexp.labelLimit)[1] || role.name;

    const emoji = button_emoji ? Util.resolvePartialEmoji(button_emoji) : null;

    const newCustomId = {
      c: this.data.name,
      count: 0,
      d: Date.now(),
      roleId: role.id,
    };

    const button = new MessageButton()
      .setCustomId(JSON.stringify(newCustomId))
      .setDisabled(button_disabled)
      .setEmoji(emoji)
      .setLabel(`${button_name} 0`)
      .setStyle(button_style);

    const components = [new MessageActionRow().setComponents([button])];

    const embeds = [new MessageEmbed()
      .setColor('RANDOM')
      .setDescription(description || '')
      .setTitle(title || description ? '' : 'ButtonRoles')];

    try {
      await channel.send({ embeds, components });

      return await interaction.editReply(this.t('?created', { locale, string: 'Button Role' }));
    } catch {
      return await interaction.editReply(this.t('createError', { locale, string: 'Button Role' }));
    }
  }

  async edit(interaction = this.CommandInteraction) {
    const { locale, options } = interaction;

    const channel = options.getChannel('channel');
    const message_id = options.getString('message_id').match(this.regexp.messageURL)[1];
    const subcommand = options.getSubcommand();

    const message = await this.getMessageById(channel, message_id);

    if (!message) return await interaction.editReply(this.t('message404', { locale }));

    if (!message.editable) return await interaction.editReply(this.t('messageNotEditable', { locale }));

    if (subcommand === 'message') {
      const [, title, description] = options.getString('text').match(this.regexp.embed);

      const embeds = [new MessageEmbed()
        .setColor('RANDOM')
        .setDescription(description || '')
        .setTitle(title || '')];

      try {
        await message.edit({ embeds });

        return await interaction.editReply(this.t('?edited', { locale, string: 'Button Role' }));
      } catch {
        return await interaction.editReply(this.t('editError', { locale, string: 'Button Role' }));
      }
    }

    if (subcommand === 'button') {
      const buttonId = options.getString('button');
      const button_name = options.getString('button_name')?.match(this.regexp.labelLimit)[1];
      const button_style = options.getString('button_style');
      const button_disabled = options.getBoolean('button_disabled');
      const button_emoji = options.getString('button_emoji');
      const role = options.getRole('role');

      const emoji = button_emoji ? Util.resolvePartialEmoji(button_emoji) : null;

      const components = message.components.map(row => {
        if (row.components[0].type !== 'BUTTON') return row;

        row.components = row.components.map((button, i) => {
          if (button.customId !== buttonId && buttonId.split(' |')[0] != i + 1) return button;

          /** @type {customId} */
          const { c, command, count, d, date, roleId } = this.util.parseJSON(button.customId);

          button.setCustomId(JSON.stringify({ c: c || command, count, d: d || date, roleId: role?.id || roleId }))
            .setDisabled(typeof button_disabled === 'boolean' ? button_disabled : button.disabled)
            .setEmoji(emoji || button.emoji)
            .setLabel(button_name ? `${button_name} ${count}` : button.label)
            .setStyle(button_style || button.style);

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

  async add(interaction = this.CommandInteraction) {
    const { locale, options } = interaction;

    const channel = options.getChannel('channel');
    const message_id = options.getString('message_id').match(this.regexp.messageURL)[1];
    const subcommand = options.getSubcommand();

    const message = await this.getMessageById(channel, message_id);

    if (!message) return await interaction.editReply(this.t('message404', { locale }));

    if (!message.editable) return await interaction.editReply(this.t('messageNotEditable', { locale }));

    if (subcommand === 'button') {
      const button_style = options.getString('button_style') || 'PRIMARY';
      const button_emoji = options.getString('button_emoji');
      const button_disabled = options.getBoolean('button_disabled');
      const role = options.getRole('role');
      const button_name = options.getString('button_name')?.match(this.regexp.labelLimit)[1] || role.name;

      const emoji = button_emoji ? Util.resolvePartialEmoji(button_emoji) : null;

      const newCustomId = {
        c: this.data.name,
        count: 0,
        d: Date.now(),
        roleId: role.id,
      };

      const button = new MessageButton()
        .setCustomId(JSON.stringify(newCustomId))
        .setDisabled(button_disabled)
        .setEmoji(emoji)
        .setLabel(`${button_name} 0`)
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

  async remove(interaction = this.CommandInteraction) {
    const { locale, options } = interaction;

    const channel = options.getChannel('channel');
    const message_id = options.getString('message_id').match(this.regexp.messageURL)[1];
    const subcommand = options.getSubcommand();

    const message = await this.getMessageById(channel, message_id);

    if (!message) return await interaction.editReply(this.t('message404', { locale }));

    if (!message.editable) return await interaction.editReply(this.t('messageNotEditable', { locale }));

    if (subcommand === 'button') {
      const buttonId = options.getString('button');

      const components = message.components.map(row => {
        if (row.components[0].type !== 'BUTTON') return row;

        row.components = row.components.filter((button, i) =>
          button.customId !== buttonId && buttonId.split(' |')[0] != i + 1);

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
        m.components.some(c => c.components[0].type === 'BUTTON') && regex.test(m.id));

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

    if (focused.name === 'button') {
      const message_id = options.getString('message_id');

      const message = await this.getMessageById(channel, message_id);

      if (!message) return await interaction.respond([]);

      if (!message.editable) return await interaction.respond([]);

      const { components } = message;

      for (let i = 0; i < components.length; i++) {
        const component = components[i];

        if (component.components[0].type !== 'BUTTON') continue;

        for (let i2 = 0; i2 < component.components.length; i2++) {
          const element = component.components[i2];

          const { customId, disabled, label, style } = element;

          const { roleId } = this.util.parseJSON(customId);

          const role = await guild.roles.fetch(roleId);

          const buttonProps = [
            `${i2 + 1}`,
            label ? `| ${label}` : '',
            `| ${role?.name}`,
            `| ${roleId}`,
            `| ${style}`,
            disabled ? '| disabled' : '',
          ];

          const buttonName = buttonProps.join(' ').trimStart();

          if (regex.test(buttonName))
            res.push({
              name: buttonName.match(this.regexp.labelLimit)[1],
              value: customId,
            });
        }
      }
    }

    await interaction.respond(res);
  }

  async addAutocomplete(interaction = this.AutocompleteInteraction) {
    await this.editAutocomplete(interaction);
  }

  async removeAutocomplete(interaction = this.AutocompleteInteraction) {
    await this.editAutocomplete(interaction);
  }
};

/**
 * @typedef customId
 * @property {string} c command
 * @property {number} count
 * @property {number} d date
 * @property {string} roleId
 */