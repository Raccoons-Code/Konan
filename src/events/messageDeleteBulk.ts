import client from "../client";
import prisma from "../database/prisma";

client.on("messageDeleteBulk", async function (messages, channel) {
  await prisma.wordleInstance.updateMany({
    where: {
      OR: messages.map(message => ({ messageId: message.id })),
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
