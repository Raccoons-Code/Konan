import client from "../client";
import prisma from "../database/prisma";

client.on("messageDeleteBulk", async function (messages, channel) {
  await prisma.wordleInstance.updateMany({
    where: {
      OR: messages.map(message => ({ message_id: message.id })),
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
