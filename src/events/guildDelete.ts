import client, { logger } from "../client";
import prisma from "../database/prisma";

client.on("guildDelete", async function (guild) {
  await Promise.all([
    logger.oldGuild(guild),

    prisma.$transaction([
      prisma.wordle.updateMany({
        where: {
          guild_id: guild.id,
          ended_at: {
            isSet: false,
          },
        },
        data: {
          ended_at: new Date(),
        },
      }),
    ]),
  ]);
});
