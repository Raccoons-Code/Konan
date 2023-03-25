import { Message, PermissionFlagsBits } from "discord.js";
import { setTimeout as sleep } from "node:timers/promises";
import Command from "../../structures/Command";
import { PERMISSIONS_STRING } from "../../util/constants";

export default class extends Command {
  constructor() {
    super({
      name: "makepermroles",
      private: true,
      appPermissions: ["ManageRoles"],
    });
  }

  async execute(message: Message) {
    if (!message.guild) return;

    for (const perm of PERMISSIONS_STRING) {
      let color = PermissionFlagsBits[perm];

      while (color > 0xffffff) color -= 0xffffffn;

      // eslint-disable-next-line no-await-in-loop
      await message.guild.roles.create({
        name: perm,
        permissions: perm,
        color: Number(color),
      });

      // eslint-disable-next-line no-await-in-loop
      await sleep(2000);
    }
  }
}
