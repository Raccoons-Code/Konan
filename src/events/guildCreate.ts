import client, { appStats, logger } from "../client";

client.on("guildCreate", async function (guild) {
  await Promise.all([
    appStats.fetch(),

    logger.newGuild(guild),
  ]);
});
