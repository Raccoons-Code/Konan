const { SlashCommand } = require('../../classes');
const { Constants, MessageButton, MessageActionRow, MessageEmbed, Message } = require('discord.js');
const { ChannelTypes } = Constants;
const { GUILD_NEWS, GUILD_NEWS_THREAD, GUILD_PRIVATE_THREAD, GUILD_PUBLIC_THREAD, GUILD_STORE, GUILD_TEXT } = ChannelTypes;
const GuildTextChannelTypes = [GUILD_NEWS, GUILD_NEWS_THREAD, GUILD_PRIVATE_THREAD, GUILD_PUBLIC_THREAD, GUILD_STORE, GUILD_TEXT];
const ButtonStyleChoices = [['PRIMARY', 'PRIMARY'], ['SECONDARY', 'SECONDARY'], ['SUCCESS', 'SUCCESS'], ['DANGER', 'DANGER']];


module.exports = class extends SlashCommand {
  constructor(...args) {
    super(...args, {
      clientPermissions: ['EMBED_LINKS', 'MANAGE_ROLES', 'SEND_MESSAGES'],
      userPermissions: ['MANAGE_ROLES'],
    });
    this.data = this.setName('buttonroles')
      .setDescription('Button roles')
      .addSubcommand(subcommand => subcommand.setName('setup')
        .setDescription('New button role')
        .addRoleOption(option => option.setName('role')
          .setDescription('Role')
          .setRequired(true))
        .addStringOption(option => option.setName('text')
          .setDescription('Text: Title {0,256} | Description {0,4096}'))
        .addStringOption(option => option.setName('button_name')
          .setDescription('Button name - default: role name'))
        .addStringOption(option => option.setName('button_emoji')
          .setDescription('Button emoji'))
        .addBooleanOption(option => option.setName('button_disabled')
          .setDescription('Set disabled - default: false'))
        .addStringOption(option => option.setName('button_style')
          .setDescription('Button style - default: PRIMARY')
          .setChoices(ButtonStyleChoices))
        .addChannelOption(option => option.setName('channel')
          .setDescription('Channel - default: current')
          .addChannelTypes(GuildTextChannelTypes)))
      .addSubcommandGroup(subcommandgroup => subcommandgroup.setName('edit')
        .setDescription('Edit button role')
        .addSubcommand(subcommand => subcommand.setName('message')
          .setDescription('Message')
          .addChannelOption(option => option.setName('channel')
            .setDescription('Channel')
            .setRequired(true)
            .addChannelTypes(GuildTextChannelTypes))
          .addStringOption(option => option.setName('message_id')
            .setDescription('Message id | Message URL')
            .setAutocomplete(true)
            .setRequired(true))
          .addStringOption(option => option.setName('text')
            .setDescription('Text: Title {0,256} | Description {0,4096}')
            .setRequired(true)))
        .addSubcommand(subcommand => subcommand.setName('button')
          .setDescription('Edit a button in a button role')
          .addChannelOption(option => option.setName('channel')
            .setDescription('Channel')
            .setRequired(true)
            .addChannelTypes(GuildTextChannelTypes))
          .addStringOption(option => option.setName('message_id')
            .setDescription('Message id | Message URL')
            .setAutocomplete(true)
            .setRequired(true))
          .addStringOption(option => option.setName('button')
            .setDescription('Autocomplete')
            .setAutocomplete(true)
            .setRequired(true))
          .addRoleOption(option => option.setName('role')
            .setDescription('Role'))
          .addStringOption(option => option.setName('button_name')
            .setDescription('Button name'))
          .addStringOption(option => option.setName('button_style')
            .setDescription('Button style')
            .setChoices(ButtonStyleChoices))
          .addStringOption(option => option.setName('button_emoji')
            .setDescription('Button emoji'))
          .addBooleanOption(option => option.setName('button_disabled')
            .setDescription('Set disabled'))))
      .addSubcommandGroup(subcommandgroup => subcommandgroup.setName('add')
        .setDescription('Add')
        .addSubcommand(subcommand => subcommand.setName('button')
          .setDescription('Add a new button in a button role')
          .addChannelOption(option => option.setName('channel')
            .setDescription('Channel')
            .setRequired(true)
            .addChannelTypes(GuildTextChannelTypes))
          .addStringOption(option => option.setName('message_id')
            .setDescription('Message id | Message URL')
            .setAutocomplete(true)
            .setRequired(true))
          .addRoleOption(option => option.setName('role')
            .setDescription('Role')
            .setRequired(true))
          .addStringOption(option => option.setName('button_name')
            .setDescription('Button name'))
          .addStringOption(option => option.setName('button_style')
            .setDescription('Button style')
            .setChoices(ButtonStyleChoices))
          .addStringOption(option => option.setName('button_emoji')
            .setDescription('Button emoji'))
          .addBooleanOption(option => option.setName('button_disabled')
            .setDescription('Set disabled'))))
      .addSubcommandGroup(subcommandgroup => subcommandgroup.setName('remove')
        .setDescription('Remove')
        .addSubcommand(subcommand => subcommand.setName('button')
          .setDescription('Remove a button from a button role')
          .addChannelOption(option => option.setName('channel')
            .setDescription('Channel')
            .setRequired(true)
            .addChannelTypes(GuildTextChannelTypes))
          .addStringOption(option => option.setName('message_id')
            .setDescription('Message id | Message URL')
            .setAutocomplete(true)
            .setRequired(true))
          .addStringOption(option => option.setName('button')
            .setDescription('Autocomplete')
            .setAutocomplete(true)
            .setRequired(true))));
  }

  async execute(interaction = this.CommandInteraction) {
    const { locale, memberPermissions, options } = interaction;

    if (!interaction.inGuild())
      return interaction.reply({
        content: this.t('onlyOnServer', { locale }),
        ephemeral: true,
      });

    const userPermissions = memberPermissions.missing(this.props.userPermissions);

    if (userPermissions.length) {
      if (interaction.isAutocomplete()) return interaction.respond([]);

      return interaction.reply({
        content: this.t('missingUserPermission', { locale, PERMISSIONS: userPermissions }),
        ephemeral: true,
      });
    }

    const command = options.getSubcommandGroup(false) || options.getSubcommand();

    if (interaction.isAutocomplete())
      return this[`${command}Autocomplete`]?.(interaction);

    await interaction.deferReply({ ephemeral: true });

    this[command]?.(interaction);
  }

  async setup(interaction = this.CommandInteraction) {
    const { client, guild, locale, options } = interaction;

    const [, title, description] = options.getString('text')?.match(this.textRegexp) || [];
    const button_style = options.getString('button_style') || 'PRIMARY';
    const button_emoji = options.getString('button_emoji');
    const button_disabled = options.getBoolean('button_disabled');
    const channel = options.getChannel('channel') || interaction.channel;
    const role = options.getRole('role');
    const button_name = options.getString('button_name')?.match(this.labelRegex)[1] || role.name;

    const emoji = button_emoji ? client.emojis.resolveIdentifier(button_emoji) ||
      client.emojis.resolve(button_emoji) ||
      guild.emojis.resolve(button_emoji) ||
      await guild.emojis.fetch(button_emoji).catch(() => null) : null;

    const newCustomId = {
      command: this.data.name,
      count: 0,
      date: Date.now(),
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
      .setTitle(title || description ? '' : 'ButtonRoles')
      .setDescription(description || '')];

    try {
      await channel.send({ embeds, components });
      interaction.editReply(this.t('?created', { locale, string: 'Button Role' }));
    } catch {
      interaction.editReply(this.t('createError', { locale, string: 'Button Role' }));
    }
  }

  async edit(interaction = this.CommandInteraction) {
    const { client, guild, locale, options } = interaction;

    const channel = options.getChannel('channel');
    const message_id = options.getString('message_id').match(this.messageURLRegex)[1];
    const subcommand = options.getSubcommand();

    const message = await this.getMessageById(channel, message_id);

    if (!message) return interaction.editReply(this.t('message404', { locale }));

    if (!message.editable) return interaction.respond(this.t('messageNotEditable', { locale }));

    if (subcommand === 'message') {
      const [, title, description] = options.getString('text').match(this.textRegexp);

      const embeds = [new MessageEmbed()
        .setColor('RANDOM')
        .setTitle(title || '')
        .setDescription(description || '')];

      try {
        await message.edit({ embeds });
        return interaction.editReply(this.t('?edited', { locale, string: 'Button Role' }));
      } catch {
        return interaction.editReply(this.t('editError', { locale, string: 'Button Role' }));
      }
    }

    if (subcommand === 'button') {
      const buttonId = options.getString('button');
      const button_name = options.getString('button_name')?.match(this.labelRegex)[1];
      const button_style = options.getString('button_style');
      const button_disabled = options.getBoolean('button_disabled');
      const button_emoji = options.getString('button_emoji');
      const role = options.getRole('role');

      const emoji = button_emoji ? client.emojis.resolveIdentifier(button_emoji) ||
        client.emojis.resolve(button_emoji) ||
        guild.emojis.resolve(button_emoji) ||
        await guild.emojis.fetch(button_emoji).catch(() => null) : null;

      const components = message.components.map(row => {
        if (row.components[0].type !== 'BUTTON') return row;

        row.components = row.components.map(button => {
          if (button.customId !== buttonId) return button;

          const oldCustomId = JSON.parse(button.customId);

          const newCustomId = {
            ...oldCustomId,
            roleId: role?.id || oldCustomId.roleId,
          };

          button.setCustomId(JSON.stringify(newCustomId))
            .setDisabled(typeof button_disabled === 'boolean' ? button_disabled : button.disabled)
            .setEmoji(emoji || button.emoji)
            .setLabel(`${button_name || button.label} ${oldCustomId.count}`)
            .setStyle(button_style || button.style);

          return button;
        });

        return row;
      });

      try {
        await message.edit({ components });
        return interaction.editReply(this.t('?edited', { locale, string: 'Button Role' }));
      } catch {
        return interaction.editReply(this.t('editError', { locale, string: 'Button Role' }));
      }
    }
  }

  async add(interaction = this.CommandInteraction) {
    const { client, guild, locale, options } = interaction;

    const channel = options.getChannel('channel');
    const message_id = options.getString('message_id').match(this.messageURLRegex)[1];
    const subcommand = options.getSubcommand();

    const message = await this.getMessageById(channel, message_id);

    if (!message) return interaction.editReply(this.t('message404', { locale }));

    if (!message.editable) return interaction.respond(this.t('messageNotEditable', { locale }));

    if (subcommand === 'button') {
      const button_style = options.getString('button_style') || 'PRIMARY';
      const button_emoji = options.getString('button_emoji');
      const button_disabled = options.getBoolean('button_disabled');
      const role = options.getRole('role');
      const button_name = options.getString('button_name')?.match(this.labelRegex)[1] || role.name;

      const emoji = button_emoji ? client.emojis.resolveIdentifier(button_emoji) ||
        client.emojis.resolve(button_emoji) ||
        guild.emojis.resolve(button_emoji) ||
        await guild.emojis.fetch(button_emoji).catch(() => null) : null;

      const newCustomId = {
        command: this.data.name,
        count: 0,
        date: Date.now(),
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
        return interaction.editReply(this.t('buttonAdded', { locale }));
      } catch {
        return interaction.editReply(this.t('buttonAddError', { locale }));
      }
    }
  }

  async remove(interaction = this.CommandInteraction) {
    const { locale, options } = interaction;

    const channel = options.getChannel('channel');
    const message_id = options.getString('message_id').match(this.messageURLRegex)[1];
    const subcommand = options.getSubcommand();

    const message = await this.getMessageById(channel, message_id);

    if (!message) return interaction.editReply(this.t('message404', { locale }));

    if (!message.editable) return interaction.respond(this.t('messageNotEditable', { locale }));

    if (subcommand === 'button') {
      const buttonId = options.getString('button');

      const components = message.components.map(row => {
        if (row.components[0].type !== 'BUTTON') return row;

        row.components = row.components.filter(button => button.customId !== buttonId);

        return row;
      });

      try {
        await message.edit({ components });
        return interaction.editReply(this.t('buttonRemoved', { locale }));
      } catch {
        return interaction.editReply(this.t('buttonRemoveError', { locale }));
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
      const messages = channel.messages.cache.size ? channel.messages.cache : await channel.messages.fetch();

      const messages_filtered = messages.filter(m => m.author.id === client.user.id &&
        m.embeds.length && m.components.some(c => c.components[0].type === 'BUTTON') ?
        focused.value.length && regex.test(m.id) || regex.test(m.embeds[0]?.title) ||
        regex.test(m.embeds[0]?.description) : false);

      const messages_array = messages_filtered.toJSON();

      for (let i = 0; i < messages_array.length; i++) {
        const message = messages_array[i];

        const { embeds, id } = message;

        const [embed] = embeds;

        const title = embed?.title?.slice(0, 20);

        const description = embed?.description?.slice(0, 20);

        if (title || description)
          res.push({
            name: `${id}`,
            value: `${id}`,
          });

        if (i === 24) break;
      }
    }

    if (focused.name === 'button') {
      const message_id = options.getString('message_id');

      const message = await this.getMessageById(channel, message_id);

      if (!message) return interaction.respond([]);

      if (!message.editable) return interaction.respond([]);

      const { components } = message;

      for (let i = 0; i < components.length; i++) {
        const component = components[i];

        if (component.components[0].type !== 'BUTTON') continue;

        for (let i2 = 0; i2 < component.components.length; i2++) {
          const element = component.components[i2];

          const { customId, label } = element;

          const { roleId } = JSON.parse(customId);

          const role = await guild.roles.fetch(roleId);

          const buttonName = `${label ? label : `Button ${i2 + 1}`} | ${role.name} | ${roleId}`;

          if (regex.test(buttonName))
            res.push({
              name: buttonName.match(this.limitRegex)[1],
              value: customId,
            });
        }
      }
    }

    interaction.respond(res);
  }

  async addAutocomplete(interaction = this.AutocompleteInteraction) {
    this.editAutocomplete(interaction);
  }

  async removeAutocomplete(interaction = this.AutocompleteInteraction) {
    this.editAutocomplete(interaction);
  }
};