const { SlashCommand } = require('../../classes');
const { GuildChannel, MessageEmbed } = require('discord.js');

module.exports = class extends SlashCommand {
  constructor(client) {
    super(client, {
      clientPermissions: ['SEND_MESSAGES'],
      userPermissions: ['MANAGE_MESSAGES'],
    });
    this.data = this.setName('embed')
      .setDescription('Send a embed message')
      .addSubcommand(subcommand => subcommand.setName('send')
        .setDescription('Send a message')
        .addStringOption(option => option.setName('embed')
          .setDescription('Set embed: Title {0,256} | Description {0,4096}')
          .setRequired(true))
        .addChannelOption(option => option.setName('channel')
          .setDescription('Channel')
          .addChannelTypes(this.GuildTextChannelTypes))
        .addStringOption(option => option.setName('content')
          .setDescription('Set content'))
        .addStringOption(option => option.setName('image_url')
          .setDescription('Image URL')))
      .addSubcommandGroup(subcommandgroup => subcommandgroup.setName('edit')
        .setDescription('Edit')
        .addSubcommand(subcommand => subcommand.setName('embed')
          .setDescription('Edit a embed.')
          .addChannelOption(channel => channel.setName('channel')
            .setDescription('Channel')
            .setRequired(true)
            .addChannelTypes(this.GuildTextChannelTypes))
          .addStringOption(option => option.setName('message_id')
            .setDescription('Message ID | Message URL')
            .setAutocomplete(true)
            .setRequired(true))
          .addStringOption(option => option.setName('embed')
            .setDescription('Set embed: Title {0,256} | Description {0,4096}'))
          .addStringOption(option => option.setName('content')
            .setDescription('Set content'))
          .addStringOption(option => option.setName('image_url')
            .setDescription('Image URL'))));
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

  async send(interaction = this.CommandInteraction) {
    const { client, locale, member, options } = interaction;

    const channel = options.getChannel('channel') || interaction.channel;
    const [, content] = options.getString('content')?.match(this.regexp.content) || [];
    const [, title, description] = options.getString('embed')?.match(this.regexp.embed) || [];
    const image_url = options.getString('image_url');

    const clientPermissions = channel.permissionsFor(client.user.id).missing(this.props.clientPermissions);

    if (clientPermissions.length)
      return await interaction.editReply(this.t('missingChannelPermission',
        { locale, PERMISSIONS: clientPermissions }));

    const embeds = [new MessageEmbed()
      .setColor('RANDOM')
      .setDescription(description.replaceAll(/(\s{2})/g, '\n'))
      .setFooter({ text: member.displayName, iconURL: member.displayAvatarURL() })
      .setImage(image_url)
      .setTimestamp(Date.now())
      .setTitle(title)];

    if (!clientPermissions.includes('SEND_MESSAGES')) {
      try {
        await this.sendEmbed({ channel, content, embeds });

        return await interaction.editReply(':heavy_check_mark:⠀');
      } catch (error) {
        return await interaction.editReply(':x:⠀');
      }
    }
  }

  async edit(interaction = this.CommandInteraction) {
    const { client, locale, member, options } = interaction;

    const channel = options.getChannel('channel');
    const message_id = options.getString('message_id').match(this.regexp.messageURL)[1];
    const subcommand = options.getSubcommand();

    const message = await this.getMessageById(channel, message_id);

    if (!message) return await interaction.editReply(this.t('message404', { locale }));

    if (!message.editable) return await interaction.editReply(this.t('messageNotEditable', { locale }));

    if (subcommand === 'embed') {
      const [, title, description] = options.getString('embed').match(this.regexp.embed);
      const [, content] = options.getString('content')?.match(this.regexp.content) || [];
      const image_url = options.getString('image_url');

      const embeds = [new MessageEmbed()
        .setColor('RANDOM')
        .setDescription(description.replaceAll(/(\s{2})/g, '\n'))
        .setFooter({ text: member.displayName, iconURL: member.displayAvatarURL() })
        .setImage(image_url)
        .setTimestamp(Date.now())
        .setTitle(title)];

      const clientPermissions = channel.permissionsFor(client.user.id).missing(this.props.clientPermissions);

      if (!clientPermissions?.includes('SEND_MESSAGES')) {
        try {
          await message.edit({ content, embeds });

          return await interaction.editReply(':heavy_check_mark:⠀');
        } catch (error) {
          return await interaction.editReply(':x:⠀');
        }
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

      const messages_filtered = messages.filter(m => m.author.id === client.user.id && m.embeds.length &&
        regex.test(m.id));

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

    await interaction.respond(res);
  }

  /** @param {EmbedProps} options */
  async sendEmbed(options) {
    const { channel, content, embeds } = options;

    return await channel.send({ content, embeds });
  }
};

/**
 * @typedef EmbedProps
 * @property {GuildChannel} channel
 * @property {string?} [content]
 * @property {MessageEmbed[]} [embeds]
 */