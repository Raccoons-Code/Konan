import { SlashCommandBuilder } from '@discordjs/builders';
import { DiscordTogether } from 'discord-together';
import { ApplicationCommandOptionChoice, AutocompleteInteraction, CommandInteraction, Constants, PermissionString, User } from 'discord.js';
import { Client, SlashCommand } from '../../structures';

const { ChannelTypes } = Constants;
const { GUILD_VOICE } = ChannelTypes;

export default class WatchTogether extends SlashCommand {
  discordTogether!: DiscordTogether<{ [k: string]: string }>;
  applications!: (keyof DiscordTogether<{ [k: string]: string }>['applications'])[];

  constructor(client: Client) {
    super(client, {
      category: 'Utility',
      clientPermissions: ['CREATE_INSTANT_INVITE'],
    });

    if (client) {
      this.discordTogether = new DiscordTogether(client);
      this.applications = Object.keys(this.discordTogether.applications);
      client.discordTogether = this.discordTogether;
    }

    this.data = new SlashCommandBuilder().setName('party')
      .setDescription('Create an activity party together - Powered by Discord Together.')
      .addStringOption(option => option.setName('activity')
        .setDescription('Select activity.')
        .setAutocomplete(true)
        .setRequired(true))
      .addChannelOption(option => option.setName('channel')
        .setDescription('Select a voice channel.')
        .addChannelTypes(<any>[GUILD_VOICE]));
  }

  async execute(interaction: CommandInteraction | AutocompleteInteraction) {
    const { locale } = interaction;

    if (!interaction.inCachedGuild()) {
      if (interaction.isAutocomplete()) return await interaction.respond([]);

      return await interaction.reply(this.t('onlyOnServer', { locale }));
    }

    if (interaction.isAutocomplete())
      return await this.executeAutocomplete(interaction);

    const { client, member, options } = interaction;

    const channel = options.getChannel('channel') ?? member.voice.channel;

    if (!channel || channel.type !== 'GUILD_VOICE')
      return await interaction.reply({
        content: `${member}, ${this.t('userMustBeOnVoiceChannel', { locale })}`,
        ephemeral: true,
      });

    const clientPermissions = channel.permissionsFor(<User>client.user)
      ?.missing(this.props?.clientPermissions as PermissionString[]) ?? [];

    if (clientPermissions.length)
      return await interaction.reply({
        content: `${member}, ${this.t('missingChannelPermission', { locale, PERMISSIONS: clientPermissions })}`,
        ephemeral: true,
      });

    const activity = options.getString('activity', true).toLowerCase();

    try {
      const invite = await this.discordTogether.createTogetherCode(channel.id, activity);

      await interaction.reply({ content: `${invite.code}`, fetchReply: true });
    } catch (error: any) {
      if (error.name === 'SyntaxError')
        return await interaction.reply({ content: this.t('activity404', { locale }), ephemeral: true });

      client.sendError(error);

      await interaction.reply({
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

    await interaction.respond(res);
  }

  setChoices(applications: any[], options: { locale: string }, res: ApplicationCommandOptionChoice[] = []) {
    const { locale } = options;

    applications = applications.filter(app => !/(awkword|doodlecrew|lettertile|puttparty|dev$)/i.test(app));

    for (let i = 0; i < applications.length; i++) {
      const application = applications[i];

      res.push({
        name: `${this.t(application, { locale })}`,
        value: `${application}`,
      });

      if (i === 24) break;
    }

    return res;
  }
}