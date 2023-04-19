import { CommandTypes } from "../@enum";
import client, { appOwners, appStats } from "../client";
import commandHandler from "../handlers/CommandHandler";
import Command from "../structures/Command";
import regexp from "../util/regexp";

client.on("messageCreate", async function (message) {
  if (message.author.bot) {
    appStats.botMessages++;
    return;
  }

  appStats.userMessages++;

  const me = message.guild?.members.me?.roles.botRole ?? client.user;
  const pattern = RegExp(`^\\s*<@!?&?(?:${client.user?.id}|${me?.id})>([\\w\\W]*)$`);
  const matched = message.content.match(pattern);
  if (!matched) return;

  message.text = matched[1].trim();
  message.args = message.text.split(/\s+/g);

  const matchedComponentLink = message.text.match(regexp.componentCommandNameLink) ?? [];

  const commandName = message.commandName = matchedComponentLink[3] || message.args.shift() || "help";

  const command = commandHandler.commands.get(CommandTypes.ChatInput)?.get(commandName) as Command;

  if (!command) return;

  if (command.data.private)
    if (!appOwners.isOwner(message.author.id)) return;

  const subCommand = <"execute">message.args[0].toLowerCase();

  if (command[subCommand]) {
    await command[subCommand](message);
    return;
  }

  await command.execute(message);
});
