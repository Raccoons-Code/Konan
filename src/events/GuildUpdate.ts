import { Guild } from 'discord.js';
import { Event } from '../structures';

export default class GuildUpdate extends Event<'guildUpdate'> {
  constructor() {
    super({
      intents: ['Guilds'],
      name: 'guildUpdate',
    });
  }

  async execute(oldGuild: Guild, newGuild: Guild) {
    if (oldGuild.ownerId !== newGuild.ownerId) {
      const oldOwner = await this.prisma.user.findFirst({
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