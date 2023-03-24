import client, { appStats, logger } from "../client";
import prisma from "../database/prisma";

client.on("guildDelete", async function (guild) {
  await Promise.all([
    appStats.fetch(),

    logger.oldGuild(guild),

    prisma.wordleInstance.updateMany({
      where: {
        guildId: guild.id,
        endedAt: {
          isSet: false,
        },
      },
      data: {
        endedAt: new Date(),
      },
    }),
  ]);
});
