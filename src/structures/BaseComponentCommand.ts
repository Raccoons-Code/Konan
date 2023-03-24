import { MessageComponentInteraction } from "discord.js";
import { ComponentCommandData } from "../@types";
import BaseCommand from "./BaseCommand";

export default abstract class BaseComponentCommand extends BaseCommand {
  constructor(public data: ComponentCommandData) {
    super({
      appPermissions: data.appPermissions,
      private: data.private,
      userPermissions: data.userPermissions,
    });
  }

  abstract execute(interaction: MessageComponentInteraction): Promise<any>;
}
