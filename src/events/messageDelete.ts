import client from "../client";
import prisma from "../database/prisma";

client.on("messageDelete", async function (message) {
  await prisma.wordleInstance.updateMany({
    where: {
      message_id: message.id,
      ended_at: {
        isSet: false,
      },
    },
    data: {
      ended_at: new Date(),
    },
  });
});
