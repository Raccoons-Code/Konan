import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";
import { env } from "node:process";
import { CommandTypes } from "../@enum";
import client, { appOwners, appStats } from "../client";
import commandHandler from "../handlers/CommandHandler";
import Command from "../structures/Command";
import dMForward from "../util/DMForward";
import regexp from "../util/regexp";

client.on("messageCreate", async function (message) {
  if (message.author.bot) {
    appStats.botMessages++;
    return;
  }

  appStats.userMessages++;

  if (!message.guild) {
    dMForward.emit("messageCreate", message);
  }

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

  const subCommand = <"execute">message.args[0]?.toLowerCase();

  if (command[subCommand]) {
    await command[subCommand](message);
    return;
  }

  await command.execute(message);
});

const usersId = env.DISCORD_DM_FORWARD_USER_ID?.split(/\D+/) ?? [];

dMForward.on("messageCreate", async function (message) {
  const promisesAttachments = message.attachments.map(att => fetch(att.url)
    .then(r => r.arrayBuffer())
    .then(Buffer.from)
    .then(file => new AttachmentBuilder(file, {
      description: att.description ?? undefined,
      name: att.name,
    })));

  const files = await Promise.all(promisesAttachments);

  const sending = [];

  const embeds = message.attachments.map(att => new EmbedBuilder()
    .setImage(`attachment://${att.name}`)).slice(0, 10);

  if (!embeds.length) {
    embeds.push(new EmbedBuilder());
  }

  embeds.at(-1)
    ?.setDescription([
      message.author,
      message.author.tag,
      message.author.id,
    ].join(" "));

  const components = [
    new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setCustomId(JSON.stringify({ c: "automod", sc: "cancel" }))
          .setEmoji("✖️")
          .setStyle(ButtonStyle.Danger),
      ),
  ];

  for (const userId of usersId) {
    sending.push(client.users.send(userId, {
      components,
      content: message.content,
      embeds,
      files,
    }));
  }

  await Promise.all(sending);
});
