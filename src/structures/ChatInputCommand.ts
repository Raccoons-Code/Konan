import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { ApplicationCommandOptions } from "../@types";
import BaseApplicationCommand from "./BaseApplicationCommand";

export default abstract class ChatInputCommand extends BaseApplicationCommand {
  data = new SlashCommandBuilder();

  constructor(options?: ApplicationCommandOptions) {
    super(options);
  }

  abstract execute(interaction: ChatInputCommandInteraction): Promise<any>;
}
