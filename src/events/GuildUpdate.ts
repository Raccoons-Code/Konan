import { Guild } from 'discord.js';
import { Client, Event } from '../structures';

export default class GuildUpdate extends Event {
  constructor(client: Client) {
    super(client, {
      intents: ['GUILDS'],
      name: 'guildUpdate',
    });
  }

  async execute(oldGuild: Guild, newGuild: Guild): Promise<any> {
    const oldOwner = await this.prisma.user.findFirst({
      where: {
        id: oldGuild.ownerId,
      },
      include: {
        guilds: {
          where: {
            id: oldGuild.id,
          },
        },
      },
    });

    if (!oldOwner) return;

    if (oldGuild.ownerId !== newGuild.ownerId) {
      await this.prisma.user.upsert({
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
          id: newGuild.ownerId,
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
  }
}