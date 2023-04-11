import client, { logger } from "../client";

client.on("guildCreate", async function (guild) {
  await logger.newGuild(guild);
});
