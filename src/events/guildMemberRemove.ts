import client from "../client";
import prisma from "../database/prisma";

client.on("guildMemberRemove", async function (member) {
  await prisma.wordle.updateMany({
    where: {
      user_id: member.id,
      guild_id: member.guild.id,
      ended_at: {
        isSet: false,
      },
    },
    data: {
      ended_at: new Date(),
    },
  });
});
