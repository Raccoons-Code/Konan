import { APIApplicationCommandOptionChoice, ApplicationCommandOptionAllowedChannelTypes, AutocompleteInteraction, ButtonStyle, ChannelType, CommandInteraction, GuildTextChannelType, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder, SlashCommandSubcommandsOnlyBuilder } from 'discord.js';
import type { SlashCommandProps } from '../@types';
import BaseApplicationCommand from './BaseApplicationCommand';

const { GuildNews, GuildNewsThread, GuildPrivateThread, GuildPublicThread, GuildText, GuildVoice } = ChannelType;

export default abstract class SlashCommand extends BaseApplicationCommand {
  data!:
    | SlashCommandBuilder
    | SlashCommandOptionsOnlyBuilder
    | SlashCommandSubcommandBuilder
    | SlashCommandSubcommandGroupBuilder
    | SlashCommandSubcommandsOnlyBuilder
    | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;

  constructor(public props?: SlashCommandProps) {
    super();
  }

  abstract execute(interaction: CommandInteraction | AutocompleteInteraction): Promise<any>;

  buttonStyles: { name: keyof typeof ButtonStyle, value: ButtonStyle }[] = [
    { name: 'Primary', value: ButtonStyle.Primary },
    { name: 'Secondary', value: ButtonStyle.Secondary },
    { name: 'Success', value: ButtonStyle.Success },
    { name: 'Danger', value: ButtonStyle.Danger },
  ];

  ButtonStylesChoices: APIApplicationCommandOptionChoice<number>[] = this.buttonStyles.map(style => ({
    name: style.name,
    value: style.value,
    name_localizations: this.getLocalizations(style.name),
  }));

  GuildTextChannelTypes: Extract<ApplicationCommandOptionAllowedChannelTypes, GuildTextChannelType>[] =
    [GuildNews, GuildNewsThread, GuildPrivateThread, GuildPublicThread, GuildText, GuildVoice];

  get randomButtonStyle() {
    return this.buttonStyles[Math.floor(Math.random() * this.buttonStyles.length)];
  }

  getChoicesFromEnum<
    V extends number | string = number | string,
    T extends Record<any, any> = Record<number | string, number | string>
  >(
    enumType: T,
    withLocalizations = true,
  ) {
    const entries = Object.entries(enumType);

    return entries.slice(Math.floor(entries.length / 2), entries.length).map(([key, value]) => ({
      name: this.t(key, { locale: 'en' }),
      value: value as V,
      name_localizations: withLocalizations ? this.getLocalizations(key) : {},
    }));
  }
}