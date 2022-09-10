import { ChannelType, ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { watchTogether } from '../../modules/WatchTogether';
import { SlashCommand } from '../../structures';

export default class WatchTogether extends SlashCommand {
  constructor() {
    super({
      category: 'Utility',
      appPermissions: ['CreateInstantInvite'],
    });

    this.data = new SlashCommandBuilder().setName('party')
      .setDescription('Create an activity party together - Powered by Discord Together.')
      .setDMPermission(false)
      .setNameLocalizations(this.getLocalizations('partyName'))
      .setDescriptionLocalizations(this.getLocalizations('partyDescription'))
      .addStringOption(option => option.setName('activity')
        .setDescription('Select an activity.')
        .setNameLocalizations(this.getLocalizations('partyActivityName'))
        .setDescriptionLocalizations(this.getLocalizations('partyActivityDescription'))
        .setAutocomplete(true)
        .setRequired(true))
      .addChannelOption(option => option.setName('channel')
        .setDescription('Select a voice channel.')
        .setNameLocalizations(this.getLocalizations('partyChannelName'))
        .setDescriptionLocalizations(this.getLocalizations('partyChannelDescription'))
        .addChannelTypes(ChannelType.GuildVoice));
  }

  async execute(interaction: ChatInputCommandInteraction<'cached'>) {
    const { client, locale, member, options } = interaction;

    const channel = options.getChannel('channel') ?? member.voice.channel;

    if (!channel || channel.type !== ChannelType.GuildVoice)
      return interaction.reply({
        content: `${member}, ${this.t('userMustBeOnVoiceChannel', { locale })}`,
        ephemeral: true,
      });

    const appPerms = channel.permissionsFor(client.user!)?.missing(this.props!.appPermissions!);

    if (appPerms?.length)
      return this.replyMissingPermission(interaction, appPerms, 'missingChannelPermission');

    const activity = options.getString('activity', true).toLowerCase();

    try {
      const invite = await watchTogether.discordTogether.createTogetherCode(channel.id, activity);

      return interaction.reply({ content: `${invite.code}`, fetchReply: true });
    } catch (error: any) {
      if (error.name === 'SyntaxError')
        return interaction.reply({ content: this.t('activity404', { locale }), ephemeral: true });

      client.sendError(error);

      return interaction.reply({
        content: this.t('There was an error while executing this command!', { locale }),
        ephemeral: true,
      });
    }
  }
}