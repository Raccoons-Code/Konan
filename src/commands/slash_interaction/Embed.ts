import { SlashCommandBuilder } from '@discordjs/builders';
import { ApplicationCommandOptionChoiceData, AutocompleteInteraction, Client, CommandInteraction, MessageEmbed, TextChannel } from 'discord.js';
import { SlashCommand } from '../../structures';

export default class Embed extends SlashCommand {
  [k: string]: any;

  constructor(client: Client) {
    super(client, {
      category: 'Utility',
      clientPermissions: ['SEND_MESSAGES'],
      userPermissions: ['MANAGE_MESSAGES'],
    });

    this.data = new SlashCommandBuilder().setName('embed')
      .setDescription('Send a embed message.')
      .setNameLocalizations(this.getLocalizations('embedName'))
      .setDescriptionLocalizations(this.getLocalizations('embedDescription'))
      .addSubcommand(subcommand => subcommand.setName('send')
        .setDescription('Send an embed.')
        .setNameLocalizations(this.getLocalizations('embedSendName'))
        .setDescriptionLocalizations(this.getLocalizations('embedSendDescription'))
        .addStringOption(option => option.setName('embed')
          .setDescription('The embed to send. Title {0,256} | Description {0,4096}')
          .setNameLocalizations(this.getLocalizations('embedSendEmbedName'))
          .setDescriptionLocalizations(this.getLocalizations('embedSendEmbedDescription'))
          .setRequired(true))
        .addAttachmentOption(option => option.setName('attachment')
          .setDescription('The attachment to send.')
          .setNameLocalizations(this.getLocalizations('embedSendAttachmentName'))
          .setDescriptionLocalizations(this.getLocalizations('embedSendAttachmentDescription')))
        .addChannelOption(option => option.setName('channel')
          .setDescription('The channel to send.')
          .setNameLocalizations(this.getLocalizations('embedSendChannelName'))
          .setDescriptionLocalizations(this.getLocalizations('embedSendChannelDescription'))
          .addChannelTypes(...this.GuildTextChannelTypes))
        .addStringOption(option => option.setName('content')
          .setDescription('The content to send.')
          .setNameLocalizations(this.getLocalizations('embedSendContentName'))
          .setDescriptionLocalizations(this.getLocalizations('embedSendContentDescription'))))
      .addSubcommandGroup(subcommandgroup => subcommandgroup.setName('edit')
        .setDescription('Edit an embed.')
        .setNameLocalizations(this.getLocalizations('embedEditName'))
        .setDescriptionLocalizations(this.getLocalizations('embedEditDescription'))
        .addSubcommand(subcommand => subcommand.setName('embed')
          .setDescription('Edit an embed.')
          .setNameLocalizations(this.getLocalizations('embedEditEmbedName'))
          .setDescriptionLocalizations(this.getLocalizations('embedEditEmbedDescription'))
          .addChannelOption(channel => channel.setName('channel')
            .setDescription('The channel of the embed.')
            .setNameLocalizations(this.getLocalizations('embedEditEmbedChannelName'))
            .setDescriptionLocalizations(this.getLocalizations('embedEditEmbedChannelDescription'))
            .setRequired(true)
            .addChannelTypes(...this.GuildTextChannelTypes))
          .addStringOption(option => option.setName('message_id')
            .setDescription('Message ID | Message URL')
            .setNameLocalizations(this.getLocalizations('embedEditEmbedMessageIdName'))
            .setDescriptionLocalizations(this.getLocalizations('embedEditEmbedMessageIdDescription'))
            .setAutocomplete(true)
            .setRequired(true))
          .addAttachmentOption(option => option.setName('attachment')
            .setDescription('The attachment of the embed.')
            .setNameLocalizations(this.getLocalizations('embedEditEmbedAttachmentName'))
            .setDescriptionLocalizations(this.getLocalizations('embedEditEmbedAttachmentDescription')))
          .addStringOption(option => option.setName('embed')
            .setDescription('The embed to edit. Title {0,256} | Description {0,4096}')
            .setNameLocalizations(this.getLocalizations('embedEditEmbedEmbedName'))
            .setDescriptionLocalizations(this.getLocalizations('embedEditEmbedEmbedDescription')))
          .addStringOption(option => option.setName('content')
            .setDescription('The content of the message.')
            .setNameLocalizations(this.getLocalizations('embedEditEmbedContentName'))
            .setDescriptionLocalizations(this.getLocalizations('embedEditEmbedContentDescription')))));
  }

  async execute(interaction: CommandInteraction | AutocompleteInteraction) {
    const { locale } = interaction;

    if (!interaction.inCachedGuild()) {
      if (interaction.isAutocomplete()) return interaction.respond([]);

      return interaction.reply({ content: this.t('onlyOnServer', { locale }), ephemeral: true });
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

  async send(interaction: CommandInteraction<'cached'>) {
    const { client, locale, member, options } = interaction;

    const channel = <TextChannel>options.getChannel('channel') ?? interaction.channel;
    const content = options.getString('content')?.slice(0, 4096);
    const [, title, description] = options.getString('embed')?.match(this.pattern.embed) ?? [];
    const attachment = options.getAttachment('attachment')!;

    const clientPerms = channel?.permissionsFor(client.user!)?.missing(this.props!.clientPermissions!);

    if (clientPerms?.length)
      return interaction.editReply(this.t('missingChannelPermission', {
        locale,
        permission: this.t(clientPerms[0], { locale }),
      }));

    const embeds = [
      new MessageEmbed()
        .setColor('RANDOM')
        .setDescription(description ? description?.replace(/(\s{2})/g, '\n') : '')
        .setFooter({ text: member.displayName, iconURL: member.displayAvatarURL() })
        .setImage(attachment.url)
        .setTimestamp(Date.now())
        .setTitle(title),
    ];

    if (!clientPerms?.includes('SEND_MESSAGES')) {
      try {
        await channel.send({ content, embeds });

        return interaction.editReply('??????').catch(() => null);
      } catch (error) {
        return interaction.editReply('???').catch(() => null);
      }
    }
  }

  async edit(interaction: CommandInteraction<'cached'>) {
    const { client, locale, member, options } = interaction;

    const channel = <TextChannel>options.getChannel('channel', true);
    const message_id = <string>options.getString('message_id', true).match(this.pattern.messageURL)?.[1];

    const message = await channel.messages.fetch(message_id);

    if (!message) return interaction.editReply(this.t('message404', { locale }));

    if (!message.editable) return interaction.editReply(this.t('messageNotEditable', { locale }));

    const subcommand = options.getSubcommand();

    if (subcommand === 'embed') {
      const [, title, description] = options.getString('embed')?.match(this.pattern.embed) ?? [];
      const content = options.getString('content')?.slice(0, 4096);
      const attachment = options.getAttachment('attachment')!;

      const embeds = [
        new MessageEmbed()
          .setColor('RANDOM')
          .setDescription(description ? description?.replace(/(\s{2})/g, '\n') : '')
          .setFooter({ text: member.displayName, iconURL: member.displayAvatarURL() })
          .setImage(attachment.url)
          .setTimestamp(Date.now())
          .setTitle(title),
      ];

      const clientPerms = channel.permissionsFor(client.user!)?.missing(this.props!.clientPermissions!);

      if (!clientPerms?.includes('SEND_MESSAGES')) {
        try {
          await message.edit({ content, embeds });

          return interaction.editReply('???');
        } catch (error) {
          return interaction.editReply('???');
        }
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

      const messages_array = messages.filter(m =>
        m.author.id === client.user?.id &&
        m.embeds.length > 0 &&
        pattern.test(`${m.id}`)).toJSON();

      for (let i = 0; i < messages_array.length; i++) {
        const { embeds, id } = messages_array[i];

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

    return interaction.respond(res);
  }
}