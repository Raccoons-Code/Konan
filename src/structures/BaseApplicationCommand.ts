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

  #id?: string;

  private get _id() {
    this.#id = client.application?.commands.cache.findKey(c => c.name === this.data.name) ?? client.user?.id;
    return this.#id;
  }

  get id() {
    return client.application?.commands.cache.has(this.#id!) ? this.#id : this._id;
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
