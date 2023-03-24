import client, { appStats } from "../client";
import prisma from "../database/prisma";

client.on("channelDelete", async function (channel) {
  appStats.totalChannels--;

  await prisma.wordleInstance.updateMany({
    where: {
      channelId: channel.id,
      endedAt: {
        isSet: false,
      },
    },
    data: {
      endedAt: new Date(),
    },
  });
});
