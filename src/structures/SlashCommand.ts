import { APIApplicationCommandOptionChoice, ApplicationCommandOptionAllowedChannelTypes, AutocompleteInteraction, ButtonStyle, ChannelType, CommandInteraction, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from 'discord.js';
import { SlashCommandProps } from '../@types';
import BaseCommand from './BaseCommand';

const { Danger, Primary, Secondary, Success } = ButtonStyle;
const { GuildNews, GuildNewsThread, GuildPrivateThread, GuildPublicThread, GuildText } = ChannelType;

export default abstract class SlashCommand extends BaseCommand {
  data!: SlashCommandBuilder |
    SlashCommandSubcommandsOnlyBuilder |
    Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;

  constructor(public props?: SlashCommandProps) {
    super();
  }

  abstract execute(interaction: CommandInteraction | AutocompleteInteraction): Promise<any>;

  buttonStyles: { name: keyof typeof ButtonStyle, value: ButtonStyle }[] = [{
    name: 'Danger', value: Danger,
  }, {
    name: 'Primary', value: Primary,
  }, {
    name: 'Secondary', value: Secondary,
  }, {
    name: 'Success', value: Success,
  }];

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