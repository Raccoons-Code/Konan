import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder, SlashCommandSubcommandsOnlyBuilder } from 'discord.js';
import type { SlashCommandProps } from '../@types';
import BaseApplicationCommand from './BaseApplicationCommand';

export default abstract class SlashCommand extends BaseApplicationCommand {
  data = new SlashCommandBuilder();

  constructor(public props?: SlashCommandProps) {
    super();
  }

  build():
    | SlashCommandBuilder
    | SlashCommandOptionsOnlyBuilder
    | SlashCommandSubcommandBuilder
    | SlashCommandSubcommandGroupBuilder
    | SlashCommandSubcommandsOnlyBuilder
    | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'> {
    return this.data;
  }

  abstract execute(interaction: ChatInputCommandInteraction): Promise<any>;
}