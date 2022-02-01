const { SlashCommand } = require('../../classes');
const { Constants, MessageButton, MessageActionRow, MessageEmbed, Message } = require('discord.js');
const { ChannelTypes } = Constants;
const { GUILD_NEWS, GUILD_NEWS_THREAD, GUILD_PRIVATE_THREAD, GUILD_PUBLIC_THREAD, GUILD_STORE, GUILD_TEXT } = ChannelTypes;
const GuildTextChannelTypes = [GUILD_NEWS, GUILD_NEWS_THREAD, GUILD_PRIVATE_THREAD, GUILD_PUBLIC_THREAD, GUILD_STORE, GUILD_TEXT];
const ButtonStyleChoices = [['PRIMARY', 'PRIMARY'], ['SECONDARY', 'SECONDARY'], ['SUCCESS', 'SUCCESS'], ['DANGER', 'DANGER']];


module.exports = class extends SlashCommand {
  constructor(...args) {
    super(...args);
    this.textRegexp = /([^|]*)\|?(.*)/;
    this.messageURLRegex = /(?:(?:\/)?(\d+))+/;
    this.data = this.setName('button_roles')
      .setDescription('Button roles')
      .addSubcommand(subcommand => subcommand.setName('new_button_role')
        .setDescription('New button role')
        .addRoleOption(option => option.setName('role')
          .setDescription('Role')
          .setRequired(true))
        .addStringOption(option => option.setName('text')
          .setDescription('Text: Title|Description'))
        .addStringOption(option => option.setName('button_name')
          .setDescription('Button name'))
        .addStringOption(option => option.setName('button_style')
          .setDescription('Button style')
          .setChoices(ButtonStyleChoices))
        .addStringOption(option => option.setName('button_emoji')
          .setDescription('Button emoji'))
        .addBooleanOption(option => option.setName('button_disabled')
          .setDescription('Set disabled'))
        .addChannelOption(option => option.setName('channel')
          .setDescription('Channel')
          .addChannelTypes(GuildTextChannelTypes)))
      .addSubcommandGroup(subcommandgroup => subcommandgroup.setName('edit_button_role')
        .setDescription('Edit button role')
        .addSubcommand(subcommand => subcommand.setName('message')
          .setDescription('Message')
          .addChannelOption(option => option.setName('channel')
            .setDescription('Channel')
            .setRequired(true)
            .addChannelTypes(GuildTextChannelTypes))
          .addStringOption(option => option.setName('message_id')
            .setDescription('Autocomplete | Message id | Message URL')
            .setAutocomplete(true)
            .setRequired(true))
          .addStringOption(option => option.setName('text')
            .setDescription('Text: Title|Description')
            .setRequired(true)))
        .addSubcommand(subcommand => subcommand.setName('button')
          .setDescription('Edit a button in a button role')
          .addChannelOption(option => option.setName('channel')
            .setDescription('Channel')
            .setRequired(true)
            .addChannelTypes(GuildTextChannelTypes))
          .addStringOption(option => option.setName('message_id')
            .setDescription('Autocomplete | Message id | Message URL')
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
      .addSubcommand(subcommand => subcommand.setName('add_button')
        .setDescription('Add a new button in a button role')
        .addChannelOption(option => option.setName('channel')
          .setDescription('Channel')
          .setRequired(true)
          .addChannelTypes(GuildTextChannelTypes))
        .addStringOption(option => option.setName('message_id')
          .setDescription('Autocomplete | Message id | Message URL')
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
          .setDescription('Set disabled')))
      .addSubcommand(subcommand => subcommand.setName('rem_button')
        .setDescription('Remove a button from a button role')
        .addChannelOption(option => option.setName('channel')
          .setDescription('Channel')
          .setRequired(true)
          .addChannelTypes(GuildTextChannelTypes))
        .addStringOption(option => option.setName('message_id')
          .setDescription('Autocomplete | Message id | Message URL')
          .setAutocomplete(true)
          .setRequired(true))
        .addStringOption(option => option.setName('button')
          .setDescription('Autocomplete')
          .setAutocomplete(true)
          .setRequired(true)));
  }

  async execute(interaction = this.CommandInteraction) {
    const { memberPermissions, options } = interaction;

    if (!memberPermissions.has('ADMINISTRATOR')) return;

    const command = options.getSubcommandGroup(false) || options.getSubcommand();

    if (interaction.isAutocomplete())
      return this[`${command}Autocomplete`]?.(interaction);

    await interaction.deferReply({ ephemeral: true });

    this[command]?.(interaction);
  }

  async new_button_role(interaction = this.CommandInteraction) {
    const { client, guild, options } = interaction;

    const role = options.getRole('role');
    const button_name = options.getString('button_name') || role.name;
    const button_style = options.getString('button_style') || 'PRIMARY';
    const button_emoji = options.getString('button_emoji') || null;
    const button_disabled = options.getBoolean('button_disabled');
    const [, title, description] = options.getString('text')?.match(this.textRegexp) || [];
    const channel = options.getChannel('channel') || interaction.channel;

    const emoji = client.emojis.resolveIdentifier(button_emoji) ||
      client.emojis.resolve(button_emoji) ||
      guild.emojis.resolve(button_emoji) ||
      await guild.emojis.fetch(button_emoji).catch(() => null) ||
      null;

    const newCustomId = {
      command: this.data.name,
      count: 0,
      date: Date.now(),
      roleId: role.id,
    };

    const button = new MessageButton()
      .setStyle(button_style)
      .setLabel(button_name)
      .setCustomId(JSON.stringify(newCustomId))
      .setEmoji(emoji)
      .setDisabled(button_disabled);

    const components = [new MessageActionRow().setComponents([button])];

    const embeds = [new MessageEmbed()
      .setColor('RANDOM')
      .setTitle(title || 'Roles')
      .setDescription(description || '')];

    channel.send({ embeds, components }).then(() =>
      interaction.editReply('Button role successfully sended.')).catch(() =>
        interaction.editReply('Error! Unable to send Button role!'));
  }

  async add_button(interaction = this.CommandInteraction) {
    const { client, guild, options } = interaction;

    const channel = options.getChannel('channel');
    const message_id = options.getString('message_id')?.match(this.messageURLRegex)[1];

    /** @type {Message} */
    const message = channel.messages.resolve(message_id) ||
      await channel.messages.fetch(message_id);

    if (!message) return interaction.editReply('Message not found.');

    if (!message.editable) return interaction.editReply('Message not editable.');

    const role = options.getRole('role');
    const button_name = options.getString('button_name') || role.name;
    const button_style = options.getString('button_style') || 'PRIMARY';
    const button_emoji = options.getString('button_emoji') || null;
    const button_disabled = options.getBoolean('button_disabled');

    const emoji = client.emojis.resolveIdentifier(button_emoji) ||
      client.emojis.resolve(button_emoji) ||
      guild.emojis.resolve(button_emoji) ||
      await guild.emojis.fetch(button_emoji).catch(() => null) ||
      null;

    const newCustomId = {
      command: this.data.name,
      count: 0,
      date: Date.now(),
      roleId: role.id,
    };

    const button = new MessageButton()
      .setStyle(button_style)
      .setLabel(button_name)
      .setCustomId(JSON.stringify(newCustomId))
      .setEmoji(emoji)
      .setDisabled(button_disabled);

    message.components[0].addComponents([button]);

    const components = message.components;

    message.edit({ components }).then(() =>
      interaction.editReply('Button successfully added to Button role.')).catch(() =>
        interaction.editReply('Error! Unable to add a button to a Button role!'));
  }

  async add_buttonAutocomplete(interaction = this.AutocompleteInteraction) {
    if (interaction.responded) return;

    const { client, guild, options } = interaction;

    const focused = options.getFocused(true);
    const regex = RegExp(focused.value, 'i');

    const res = [];

    if (focused.name === 'message_id') {
      const channelId = options.get('channel').value;
      const channel = guild.channels.resolve(channelId) ||
        await guild.channels.fetch(channelId);

      const messages = channel.messages.cache.size ? channel.messages.cache : await channel.messages.fetch();

      const messages_filtered = messages.filter(m => m.author.id === client.user.id &&
        m.embeds.length &&
        m.components[0].components[0].type === 'BUTTON' ?
        focused.value.length && regex.test(m.embeds[0]?.title) ||
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
            name: `${title || description} | ${id}`,
            value: `${id}`,
          });

        if (i === 24) break;
      }
    }

    interaction.respond(res);
  }

  async edit_button_role(interaction = this.CommandInteraction) {
    const { client, guild, options } = interaction;

    const subcommand = options.getSubcommand();

    const channel = options.getChannel('channel');
    const message_id = options.getString('message_id').match(this.messageURLRegex)[1];

    /** @type {Message} */
    const message = channel.messages.resolve(message_id) ||
      await channel.messages.fetch(message_id);

    if (!message) return interaction.editReply('Message not found.');

    if (!message.editable) return interaction.editReply('Message not editable.');

    if (subcommand === 'message') {
      const [, title, description] = options.getString('text').match(this.textRegexp);

      const embeds = [new MessageEmbed()
        .setColor('RANDOM')
        .setTitle(title || 'Roles')
        .setDescription(description || '')];

      return message.edit({ embeds }).then(() =>
        interaction.editReply('Button role text successfully edited.')).catch(() =>
          interaction.editReply('Error! Unable to edit text from Button role.'));
    }

    if (subcommand === 'button') {
      const button = options.getString('button');
      const role = options.getRole('role');
      const button_name = options.getString('button_name') || role.name;
      const button_style = options.getString('button_style') || 'PRIMARY';
      const button_disabled = options.getBoolean('button_disabled');
      const button_emoji = options.getString('button_emoji') || null;

      const emoji = client.emojis.resolveIdentifier(button_emoji) ||
        client.emojis.resolve(button_emoji) ||
        guild.emojis.resolve(button_emoji) ||
        await guild.emojis.fetch(button_emoji).catch(() => null) ||
        null;

      const components = message.components.map(c => {
        if (c.components[0].type !== 'BUTTON') return c;

        c.components = c.components.map(b => {
          if (b.customId !== button) return b;

          const { command, count, date, roleId } = JSON.parse(b.customId);

          const newCustomId = {
            command: command,
            count: count,
            date: date,
            roleId: role?.id || roleId,
          };

          b.setStyle(button_style || b.style);
          b.setDisabled(typeof button_disabled === 'boolean' ? button_disabled : b.disabled);
          b.setEmoji(emoji || b.emoji);
          b.setLabel(button_name || b.label);
          b.setCustomId(JSON.stringify(newCustomId));

          return b;
        });

        return c;
      });

      return message.edit({ components }).then(() =>
        interaction.editReply('Button role successfully edited.')).catch(() =>
          interaction.editReply('Error! Unable to edit a button from Button role.'));
    }
  }

  async edit_button_roleAutocomplete(interaction = this.AutocompleteInteraction) {
    if (interaction.responded) return;

    const { client, guild, options } = interaction;

    const channelId = options.get('channel').value;
    const channel = guild.channels.resolve(channelId) ||
      await guild.channels.fetch(channelId);

    const focused = options.getFocused(true);
    const regex = RegExp(focused.value, 'i');

    const res = [];

    if (focused.name === 'message_id') {
      const messages = channel.messages.cache.size ? channel.messages.cache : await channel.messages.fetch();

      const messages_filtered = messages.filter(m => m.author.id === client.user.id &&
        m.embeds.length && m.components[0].components[0].type === 'BUTTON' ?
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
            name: `${title}${description ? ` | ${description}` : ''} | ${id}`,
            value: `${id}`,
          });

        if (i === 24) break;
      }
    }

    if (focused.name === 'button') {
      const message_id = options.getString('message_id');

      /** @type {Message} */
      const message = channel.messages.resolve(message_id) ||
        await channel.messages.fetch(message_id);

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

          const role = guild.roles.resolve(roleId) || await guild.roles.fetch(roleId);

          if (regex.test(label) || regex.test(roleId) || regex.test(role.name))
            res.push({
              name: `${label} | ${role.name} | ${roleId}`,
              value: customId,
            });
        }
      }
    }

    interaction.respond(res);
  }

  async rem_button(interaction = this.CommandInteraction) {
    const { options } = interaction;

    const channel = options.getChannel('channel');
    const message_id = options.getString('message_id')?.match(this.messageURLRegex)[1];
    const button = options.getString('button');

    /** @type {Message} */
    const message = channel.messages.resolve(message_id) ||
      await channel.messages.fetch(message_id);

    if (!message) return interaction.editReply('Message not found.');

    if (!message.editable) return interaction.editReply('Message not editable.');

    const components = message.components.map(c => {
      if (c.components[0].type !== 'BUTTON') return c;

      c.components = c.components.filter(b => b.customId !== button);

      return c;
    });

    const boolean = components.some(c => c.components.length);

    message.edit({ components: boolean ? components : [] }).then(() =>
      interaction.editReply('button successfully removed.')).catch(() =>
        interaction.editReply('Error! Unable to remove button!'));
  }

  async rem_buttonAutocomplete(interaction = this.AutocompleteInteraction) {
    if (interaction.responded) return;

    const { client, guild, options } = interaction;

    const channelId = options.get('channel').value;
    const channel = guild.channels.resolve(channelId) ||
      await guild.channels.fetch(channelId);

    const focused = options.getFocused(true);
    const regex = RegExp(focused.value, 'i');

    const res = [];

    if (focused.name === 'message_id') {
      const messages = channel.messages.cache.size ? channel.messages.cache : await channel.messages.fetch();

      const messages_filtered = messages.filter(m => m.author.id === client.user.id &&
        m.embeds.length ?
        focused.value.length && regex.test(m.embeds[0]?.title) ||
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
            name: `${title || description} | ${id}`,
            value: `${id}`,
          });

        if (i === 24) break;
      }
    }

    if (focused.name === 'button') {
      const message_id = options.getString('message_id')?.match(this.messageURLRegex)[1];

      /** @type {Message} */
      const message = channel.messages.resolve(message_id) ||
        await channel.messages.fetch(message_id);

      if (!message) return interaction.respond([]);

      if (!message.editable) return interaction.respond([]);

      const { components } = message.components.filter(c => c.components[0].type === 'BUTTON')[0];

      guild.roles.cache.size || await guild.roles.fetch();

      const components_filtered = components.filter(b => {
        const { roleId } = JSON.parse(b.customId);

        const role = guild.roles.resolve(roleId);

        return regex.test(roleId) || regex.test(role.name);
      });

      for (let i = 0; i < components_filtered.length; i++) {
        const { customId } = components_filtered[i];

        const { roleId } = JSON.parse(customId);

        const role = guild.roles.resolve(roleId) || await guild.roles.fetch(roleId);

        res.push({
          name: `${role.name} | ${roleId}`,
          value: `${customId}`,
        });

        if (i === 24) break;
      }
    }

    interaction.respond(res);
  }
};