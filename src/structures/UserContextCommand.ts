import { ApplicationCommandType, ContextMenuCommandBuilder, UserContextMenuCommandInteraction } from "discord.js";
import { ApplicationCommandOptions } from "../@types";
import BaseApplicationCommand from "./BaseApplicationCommand";

export default abstract class UserContextCommand extends BaseApplicationCommand {
  data = new ContextMenuCommandBuilder()
    .setType(ApplicationCommandType.User);

  constructor(options?: ApplicationCommandOptions) {
    super(options);
  }

  abstract execute(interaction: UserContextMenuCommandInteraction): Promise<any>;
}
