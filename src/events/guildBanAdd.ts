import client from "../client";
import prisma from "../database/prisma";

client.on("guildBanAdd", async function (ban) {
  await prisma.wordleInstance.updateMany({
    where: {
      user_id: ban.user.id,
      guild_id: ban.guild.id,
      ended_at: {
        isSet: false,
      },
    },
    data: {
      ended_at: new Date(),
    },
  });
});
