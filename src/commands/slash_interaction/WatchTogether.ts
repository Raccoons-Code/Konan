import { DiscordTogether } from 'discord-together';
import { ApplicationCommandOptionChoiceData, AutocompleteInteraction, ChannelType, ChatInputCommandInteraction, InteractionType, SlashCommandBuilder } from 'discord.js';
import { client } from '../../client';
import { SlashCommand } from '../../structures';

const { GuildVoice } = ChannelType;
const { ApplicationCommandAutocomplete } = InteractionType;

export default class WatchTogether extends SlashCommand {
  discordTogether!: DiscordTogether<{ [k: string]: string }>;
  applications!: (keyof DiscordTogether<{ [k: string]: string }>['applications'])[];

  constructor() {
    super({
      category: 'Utility',
      clientPermissions: ['CreateInstantInvite'],
    });

    this.discordTogether = new DiscordTogether(<any>client);
    this.applications = Object.keys(this.discordTogether.applications);
    client.discordTogether = this.discordTogether;

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
        .addChannelTypes(GuildVoice));
  }

  async execute(interaction: ChatInputCommandInteraction | AutocompleteInteraction) {
    const { locale } = interaction;

    if (!interaction.inCachedGuild()) {
      if (interaction.type === ApplicationCommandAutocomplete) return interaction.respond([]);

      return interaction.reply(this.t('onlyOnServer', { locale }));
    }

    if (interaction.type === ApplicationCommandAutocomplete)
      return this.executeAutocomplete(interaction);

    const { member, options } = interaction;

    const channel = options.getChannel('channel') ?? member.voice.channel;

    if (!channel || channel.type !== GuildVoice)
      return interaction.reply({
        content: `${member}, ${this.t('userMustBeOnVoiceChannel', { locale })}`,
        ephemeral: true,
      });

    const clientPerms = channel.permissionsFor(client.user!)?.missing(this.props!.clientPermissions!);

    if (clientPerms?.length)
      return interaction.reply({
        content: `${member}, ${this.t('missingChannelPermission', {
          locale,
          permission: this.t(clientPerms[0], { locale }),
        })}`,
        ephemeral: true,
      });

    const activity = options.getString('activity', true).toLowerCase();

    try {
      const invite = await this.discordTogether.createTogetherCode(channel.id, activity);

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

    const applications = this.applications.filter(app =>
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