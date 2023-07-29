import client from "../client";
import prisma from "../database/prisma";

client.on("channelDelete", async function (channel) {
  await prisma.wordleInstance.updateMany({
    where: {
      channel_id: channel.id,
      ended_at: {
        isSet: false,
      },
    },
    data: {
      ended_at: new Date(),
    },
  });
});
