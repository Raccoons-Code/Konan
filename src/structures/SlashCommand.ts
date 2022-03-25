import { SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from '@discordjs/builders';
import { AutocompleteInteraction, CommandInteraction, Constants, MessageButtonStyleResolvable, PermissionString } from 'discord.js';
import Base from './Base';
import Client from './Client';

const { ChannelTypes } = Constants;
const { GUILD_NEWS, GUILD_NEWS_THREAD, GUILD_PRIVATE_THREAD, GUILD_PUBLIC_THREAD, GUILD_STORE, GUILD_TEXT } = ChannelTypes;

export default class SlashCommand extends Base {
  data!: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;

  constructor(client: Client, public props?: CommandProps) {
    super(client);
  }

  public async execute(interaction: CommandInteraction | AutocompleteInteraction): Promise<any> { }

  get buttonStyles(): MessageButtonStyleResolvable[] {
    return ['DANGER', 'PRIMARY', 'SECONDARY', 'SUCCESS'];
  }

  get ButtonStylesChoices() {
    return this.buttonStyles.map(style => [style, style]) as [name: string, value: string][];
  }

  get GuildTextChannelTypes() {
    return [GUILD_NEWS, GUILD_NEWS_THREAD, GUILD_PRIVATE_THREAD, GUILD_PUBLIC_THREAD, GUILD_STORE, GUILD_TEXT];
  }

  get randomButtonStyle() {
    return this.buttonStyles[Math.floor(Math.random() * this.buttonStyles.length)];
  }
}

export interface CommandProps {
  clientPermissions?: PermissionString[]
  userPermissions?: PermissionString[]
}