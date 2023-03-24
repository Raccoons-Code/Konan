import { AnySelectMenuInteraction } from "discord.js";
import { ComponentCommandData } from "../@types";
import BaseComponentCommand from "./BaseComponentCommand";

export default abstract class SelectMenuCommand extends BaseComponentCommand {
  constructor(data: ComponentCommandData) {
    super(data);
  }

  abstract execute(interaction: AnySelectMenuInteraction): Promise<any>;
}
