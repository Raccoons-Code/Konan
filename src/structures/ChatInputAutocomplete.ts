import { AutocompleteInteraction } from "discord.js";
import type { ComponentCommandData } from "../@types";
import BaseCommand from "./BaseCommand";

export default abstract class ChatInputAutocomplete extends BaseCommand {
  constructor(public readonly data: ComponentCommandData) {
    super({
      appPermissions: data.appPermissions,
      private: data.private,
      userPermissions: data.userPermissions,
    });
  }

  abstract execute(interaction: AutocompleteInteraction): Promise<any>;
}
