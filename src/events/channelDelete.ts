import client from "../client";
import prisma from "../database/prisma";

client.on("channelDelete", async function (channel) {
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
