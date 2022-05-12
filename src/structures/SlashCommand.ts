import { SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from '@discordjs/builders';
import { APIApplicationCommandOptionChoice, ChannelType } from 'discord-api-types/v10';
import { AutocompleteInteraction, CommandInteraction, MessageButtonStyle } from 'discord.js';
import { SlashCommandProps } from '../@types';
import Base from './Base';
import Client from './Client';

const { GuildNews, GuildNewsThread, GuildPrivateThread, GuildPublicThread, GuildText } = ChannelType;

export default class SlashCommand extends Base {
  data!: SlashCommandBuilder |
    SlashCommandSubcommandsOnlyBuilder |
    Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;

  constructor(client: Client, public props?: SlashCommandProps) {
    super(client);
  }

  public async execute(interaction: CommandInteraction | AutocompleteInteraction): Promise<any> { }

  buttonStyles: MessageButtonStyle[] = ['DANGER', 'PRIMARY', 'SECONDARY', 'SUCCESS'];

  ButtonStylesChoices: APIApplicationCommandOptionChoice<string>[] = this.buttonStyles.map(style => ({
    name: style,
    value: style,
    name_localizations: this.getLocalizations(style),
  }));

  GuildTextChannelTypes: (
    ChannelType.GuildCategory |
    ChannelType.GuildNews |
    ChannelType.GuildNewsThread |
    ChannelType.GuildPrivateThread |
    ChannelType.GuildPublicThread |
    ChannelType.GuildStageVoice |
    ChannelType.GuildText |
    ChannelType.GuildVoice
  )[] = [GuildNews, GuildNewsThread, GuildPrivateThread, GuildPublicThread, GuildText];

  get randomButtonStyle() {
    return this.buttonStyles[Math.floor(Math.random() * this.buttonStyles.length)];
  }
}