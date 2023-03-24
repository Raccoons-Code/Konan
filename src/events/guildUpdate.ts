import client from "../client";
import prisma from "../database/prisma";

client.on("guildUpdate", async function (oldGuild, newGuild) {
  if (oldGuild.ownerId !== newGuild.ownerId) {
    const oldOwner = await prisma.user.findFirst({
      where: {
        id: oldGuild.ownerId,
        guilds: {
          some: {
            id: oldGuild.id,
          },
        },
      },
    });

    if (!oldOwner) return;

    await prisma.user.upsert({
      create: {
        id: newGuild.ownerId,
        guilds: {
          connectOrCreate: {
            create: {
              id: newGuild.id,
            },
            where: {
              id: newGuild.id,
            },
          },
        },
      },
      where: {
        id: oldGuild.ownerId,
      },
      update: {
        guilds: {
          connectOrCreate: {
            create: {
              id: newGuild.id,
            },
            where: {
              id: newGuild.id,
            },
          },
        },
      },
    });
  }
});
