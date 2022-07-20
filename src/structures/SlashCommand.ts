import { APIApplicationCommandOptionChoice, ApplicationCommandOptionAllowedChannelTypes, AutocompleteInteraction, ButtonStyle, ChannelType, CommandInteraction, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from 'discord.js';
import { SlashCommandProps } from '../@types';
import BaseCommand from './BaseCommand';

const { GuildNews, GuildNewsThread, GuildPrivateThread, GuildPublicThread, GuildText } = ChannelType;

export default abstract class SlashCommand extends BaseCommand {
  data!: SlashCommandBuilder |
    SlashCommandSubcommandsOnlyBuilder |
    Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;

  constructor(public props?: SlashCommandProps) {
    super();
  }

  abstract execute(interaction: CommandInteraction | AutocompleteInteraction): Promise<any>;

  buttonStyles: { name: keyof typeof ButtonStyle, value: ButtonStyle }[] = [
    { name: 'Danger', value: ButtonStyle.Danger },
    { name: 'Primary', value: ButtonStyle.Primary },
    { name: 'Secondary', value: ButtonStyle.Secondary },
    { name: 'Success', value: ButtonStyle.Success },
  ];

  ButtonStylesChoices: APIApplicationCommandOptionChoice<number>[] = this.buttonStyles.map(style => ({
    name: style.name,
    value: style.value,
    name_localizations: this.getLocalizations(style.name),
  }));

  GuildTextChannelTypes: ApplicationCommandOptionAllowedChannelTypes[] =
    [GuildNews, GuildNewsThread, GuildPrivateThread, GuildPublicThread, GuildText];

  get randomButtonStyle() {
    return this.buttonStyles[Math.floor(Math.random() * this.buttonStyles.length)];
  }
}