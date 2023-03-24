import client from "../client";
import prisma from "../database/prisma";

client.on("messageDelete", async function (message) {
  await prisma.wordleInstance.updateMany({
    where: {
      messageId: message.id,
      endedAt: {
        isSet: false,
      },
    },
    data: {
      endedAt: new Date(),
    },
  });
});
