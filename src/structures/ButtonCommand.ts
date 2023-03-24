import { ButtonInteraction } from "discord.js";
import { ComponentCommandData } from "../@types";
import BaseComponentCommand from "./BaseComponentCommand";

export default abstract class ButtonCommand extends BaseComponentCommand {
  constructor(data: ComponentCommandData) {
    super(data);
  }

  abstract execute(interaction: ButtonInteraction): Promise<any>;
}
