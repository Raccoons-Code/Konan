import client from "../client";
import prisma from "../database/prisma";

client.on("guildBanAdd", async function (ban) {
  await prisma.wordleInstance.updateMany({
    where: {
      userId: ban.user.id,
      guildId: ban.guild.id,
      endedAt: {
        isSet: false,
      },
    },
    data: {
      endedAt: new Date(),
    },
  });
});
