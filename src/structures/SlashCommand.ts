import { SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from '@discordjs/builders';
import { AutocompleteInteraction, CommandInteraction, Constants, MessageButtonStyleResolvable } from 'discord.js';
import { SlashCommandProps } from '../@types';
import Base from './Base';
import Client from './Client';

const { ChannelTypes } = Constants;
const { GUILD_NEWS, GUILD_NEWS_THREAD, GUILD_PRIVATE_THREAD, GUILD_PUBLIC_THREAD, GUILD_STORE, GUILD_TEXT } = ChannelTypes;

export default class SlashCommand extends Base {
  data!: SlashCommandBuilder |
    SlashCommandSubcommandsOnlyBuilder |
    Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;

  constructor(client: Client, public props?: SlashCommandProps) {
    super(client);
  }

  public async execute(interaction: CommandInteraction | AutocompleteInteraction): Promise<any> { }

  buttonStyles: MessageButtonStyleResolvable[] = ['DANGER', 'PRIMARY', 'SECONDARY', 'SUCCESS'];

  ButtonStylesChoices = this.buttonStyles.map(style => [style, style]) as [name: string, value: string][];

  GuildTextChannelTypes =
    [GUILD_NEWS, GUILD_NEWS_THREAD, GUILD_PRIVATE_THREAD, GUILD_PUBLIC_THREAD, GUILD_STORE, GUILD_TEXT];

  get randomButtonStyle() {
    return this.buttonStyles[Math.floor(Math.random() * this.buttonStyles.length)];
  }
}