import { ChatInputCommandInteraction, EmbedBuilder, GuildTextBasedChannel, RouteBases } from 'discord.js';
import { SlashCommand } from '../../structures';

export default class Embed extends SlashCommand {
  [x: string]: any;

  constructor() {
    super({
      category: 'Utility',
      appPermissions: ['SendMessages', 'AttachFiles'],
      userPermissions: ['ManageMessages'],
    });

    this.data.setName('embed')
      .setDescription('Send a embed message.');
  }

  build() {
    return this.data
      .setDMPermission(false)
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

  async execute(interaction: ChatInputCommandInteraction<'cached'>) {
    const { channel, client, memberPermissions, options } = interaction;

    const userPerms = memberPermissions.missing(this.props!.userPermissions!);

    if (userPerms.length)
      return this.replyMissingPermission(interaction, userPerms, 'missingUserPermission');

    const appPerms = channel?.permissionsFor(client.user!)?.missing(this.props!.appPermissions!);

    if (appPerms?.length)
      return this.replyMissingPermission(interaction, appPerms, 'missingChannelPermission');

    const subcommand = options.getSubcommandGroup() ?? options.getSubcommand();

    await interaction.deferReply({ ephemeral: true });

    return this[subcommand]?.(interaction);
  }

  async send(interaction: ChatInputCommandInteraction<'cached'>) {
    const { client, member, options } = interaction;

    const channel = <GuildTextBasedChannel>options.getChannel('channel') ?? interaction.channel;
    const content = options.getString('content')?.slice(0, 4096);
    const [, title, description] = options.getString('embed')?.match(this.regexp.embed) ?? [];
    const attachment = options.getAttachment('attachment');

    const appPerms = channel?.permissionsFor(client.user!)?.missing(this.props!.appPermissions!);

    if (appPerms?.length)
      return this.replyMissingPermission(interaction, appPerms, 'missingChannelPermission');

    const embeds = [
      new EmbedBuilder()
        .setColor('Random')
        .setDescription(description?.replace(/(\s{2}|\\n)/g, '\n') || null)
        .setFooter({ text: member.displayName, iconURL: member.displayAvatarURL() })
        .setImage(attachment?.url ?? RouteBases.cdn)
        .setTimestamp(Date.now())
        .setTitle(title?.replace(/(\s{2}|\\n)/g, '\n') || null),
    ];

    try {
      await channel.send({ content, embeds });

      return interaction.editReply('☑️').catch(() => null);
    } catch (error) {
      return interaction.editReply('❌').catch(() => null);
    }
  }

  async edit(interaction: ChatInputCommandInteraction<'cached'>) {
    const { locale, member, options } = interaction;

    const channel = <GuildTextBasedChannel>options.getChannel('channel', true);
    const message_id = <string>options.getString('message_id', true).match(this.regexp.messageURL)?.[1];

    const message = await channel.messages.safeFetch(message_id);
    if (!message) return interaction.editReply(this.t('message404', { locale }));
    if (!message.editable) return interaction.editReply(this.t('messageNotEditable', { locale }));

    const subcommand = options.getSubcommand();

    if (subcommand === 'embed') {
      const [, title, description] = options.getString('embed')?.match(this.regexp.embed) ?? [];
      const content = options.getString('content')?.slice(0, 4096);
      const attachment = options.getAttachment('attachment');

      if (`${content} ${title || description}` === 'null null')
        return interaction.editReply('Unable to delete all fields.');

      const embeds = (title || description) ?
        ['null'].includes(title || description) ?
          [] :
          [
            new EmbedBuilder()
              .setColor('Random')
              .setDescription(description?.replace(/(\s{2}|\\n)/g, '\n') || null)
              .setFooter({ text: member.displayName, iconURL: member.displayAvatarURL() })
              .setImage(attachment?.url ?? message.attachments.first()?.url ?? RouteBases.cdn)
              .setTimestamp(Date.now())
              .setTitle(title?.replace(/(\s{2}|\\n)/g, '\n') || null),
          ] :
        message.embeds;

      const files = embeds.length ?
        [] :
        attachment ?
          [attachment] :
          message.embeds[0].image ?
            [message.embeds[0].image.url] :
            message.attachments.toJSON();

      try {
        await message.edit({ content: content == 'null' ? null : content || message.content, embeds, files });

        return interaction.editReply(this.Util.Emoji.Success);
      } catch (error) {
        return interaction.editReply(this.Util.Emoji.Danger);
      }
    }
  }
}