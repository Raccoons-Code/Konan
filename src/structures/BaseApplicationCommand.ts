import { BaseApplicationCommandData, JSONEncodable } from "discord.js";
import { ApplicationCommandOptions } from "../@types";
import client from "../client";
import BaseCommand from "./BaseCommand";

export default abstract class BaseApplicationCommand extends BaseCommand {
  readonly abstract data: BaseApplicationCommandData
    & JSONEncodable<BaseApplicationCommandData>;

  constructor(public readonly options: ApplicationCommandOptions = {}) {
    super();
  }

  get id() {
    return client.application?.commands.cache.find(c => c.name === this.data.name)?.id ?? client.user?.id;
  }

  get commandMention() {
    return `</${this.data.name}:${this.id}>`;
  }

  build() { }

  getCommandMention(): `</${string}:${string}>`;
  getCommandMention<G extends string>(subGroup: G): `</${string} ${G}:${string}>`;
  getCommandMention<G extends string, S extends string>(subGroup: G, subCommand: S): `</${string} ${G} ${S}:${string}>`;
  getCommandMention(subGroup?: string, subCommand?: string) {
    if (subCommand)
      return `</${this.data.name} ${subGroup} ${subCommand}:${this.id}>`;

    if (subGroup)
      return `</${this.data.name} ${subGroup}:${this.id}>`;

    return this.commandMention;
  }

  toString() {
    return this.commandMention;
  }
}
