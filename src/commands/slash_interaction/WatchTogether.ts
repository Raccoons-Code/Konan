import { ApplicationCommandOptionChoiceData, AutocompleteInteraction, ChannelType, ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
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

  async execute(interaction: ChatInputCommandInteraction | AutocompleteInteraction) {
    if (!interaction.inCachedGuild())
      return this.replyOnlyOnServer(interaction);

    if (interaction.isAutocomplete())
      return this.executeAutocomplete(interaction);

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

  async executeAutocomplete(interaction: AutocompleteInteraction) {
    if (interaction.responded) return;

    const { locale, options } = interaction;

    const activity = options.getString('activity', true);
    const pattern = RegExp(activity, 'i');

    const applications = watchTogether.applications.filter(app =>
      pattern.test(`${app}`) ||
      pattern.test(this.t(`${app}`, { locale })));

    const res = this.setChoices(applications, { locale });

    return interaction.respond(res);
  }

  setChoices(applications: any[], options: { locale: string }, res: ApplicationCommandOptionChoiceData[] = []) {
    const { locale } = options;

    applications = applications.filter(app => !/(awkword|doodlecrew|lettertile|puttparty|dev$)/i.test(app));

    for (let i = 0; i < applications.length; i++) {
      const application = applications[i];

      res.push({
        name: `${this.t(application, { locale })}`,
        value: `${application}`,
      });

      if (res.length === 25) break;
    }

    return res;
  }
}