import { env } from "node:process";
import client, { appStats, logger, presence } from "../client";
import prisma from "../database/prisma";
import commandHandler from "../handlers/CommandHandler";
import TopggAutoposter from "../modules/Topgg/autoposter";

client.on("shardReady", async function (shardId, unavailableGuilds) {
  appStats.shardId = shardId;

  console.log(`Shard ${shardId} ready!`);

  if (env.DISCORD_ERROR_CHANNEL) {
    try {
      logger.ERROR_WEBHOOK = await logger.findOrCreate(env.DISCORD_ERROR_CHANNEL);
    } catch (error) {
      console.error(error);
    }
  }

  await commandHandler.load();

  const isLastShard = client.shard?.count === shardId + 1;

  await Promise.all([
    isLastShard &&
    commandHandler.register({
      reset: env.NODE_ENV === "production",
    }),

    env.DISCORD_LOG_CHANNEL &&
    logger.findOrCreate(env.DISCORD_LOG_CHANNEL)
      .then(webhook => { logger.LOG_WEBHOOK = webhook; })
      .catch(() => null),

    isLastShard &&
    appStats.fetch(),

    client.application?.fetch(),

    prisma.$connect()
      .then(() => {
        if (!unavailableGuilds?.size) return;

        const guildIds = Array.from(unavailableGuilds);

        prisma.$transaction([
          prisma.wordleInstance.updateMany({
            where: {
              OR: guildIds.map(guildId => ({ guildId })),
              endedAt: {
                isSet: false,
              },
            },
            data: {
              endedAt: new Date(),
            },
          }),
        ]);
      }),
  ]);

  presence.start();

  new TopggAutoposter();

  console.log(`Cluster ${appStats.workerId} Shard ${shardId} ready done!`);
});
