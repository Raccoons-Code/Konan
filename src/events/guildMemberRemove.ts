import client from "../client";
import prisma from "../database/prisma";

client.on("guildMemberRemove", async function (member) {
  await prisma.wordleInstance.updateMany({
    where: {
      userId: member.id,
      guildId: member.guild.id,
      endedAt: {
        isSet: false,
      },
    },
    data: {
      endedAt: new Date(),
    },
  });
});
