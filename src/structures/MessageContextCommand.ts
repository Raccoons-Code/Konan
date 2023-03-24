import { ApplicationCommandType, ContextMenuCommandBuilder, MessageContextMenuCommandInteraction } from "discord.js";
import { ApplicationCommandOptions } from "../@types";
import BaseApplicationCommand from "./BaseApplicationCommand";

export default abstract class MessageContextCommand extends BaseApplicationCommand {
  data = new ContextMenuCommandBuilder()
    .setType(ApplicationCommandType.Message);

  constructor(options?: ApplicationCommandOptions) {
    super(options);
  }

  abstract execute(interaction: MessageContextMenuCommandInteraction): Promise<any>;
}
