import { Team } from "discord.js";
import { env } from "node:process";
import client from ".";

export default class ApplicationOwners {
  constructor() { }

  #ids: string[] = [];

  get ids() {
    if (this.#ids.length)
      return this.#ids;

    if (env.OWNER_ID) {
      this.#ids.push(...env.OWNER_ID.split(/\s*,\s*/));
    }

    if (client.application?.owner instanceof Team) {
      this.#ids.push(...client.application.owner.members.keys());
    }

    if (client.application?.owner) {
      this.#ids.push(client.application.owner.id);
    }

    return this.#ids;
  }

  isOwner(userId: string) {
    return this.ids.includes(userId);
  }
}
