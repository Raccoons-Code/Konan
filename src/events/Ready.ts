import { Guild } from 'discord.js';
import { Client, Event } from '../structures';

export default class Ready extends Event {
  ytURL = 'https://www.youtube.com/watch?v=';

  constructor(client: Client) {
    super(client, {
      name: 'ready',
      listener: 'once',
    });
  }

  async execute(client: Client) {
    console.log(`Ready! ${client.user?.tag} is on ${client.guilds.cache.size} servers.`);

    await client.application?.fetch();

    client.invite = client.generateInvite({
      scopes: ['applications.commands', 'bot'],
      permissions: BigInt(545460321791),
    });

    client.topggAutoposter();
    this.deleteMyGuilds(client);
    await client.fetchStats();
    this.setPresence(client);
  }

  async deleteGuild(guild: Guild) {
    await guild.delete().then(() => console.log(guild.name, 'deleted!')).catch(() => null);
  }

  async deleteMyGuilds(client: Client) {
    const guilds = client.guilds.cache.filter(g => g.ownerId === client.user?.id);

    let multiplier = 0;

    for (const [, guild] of guilds) {
      const timeout = 60000 - (Date.now() - guild.createdTimestamp);

      multiplier++;

      setTimeout(async () => {
        await this.deleteGuild(guild);
      }, ((timeout < 0 ? 0 : timeout) + (multiplier * 1000)));
    }
  }

  async setPresence(client: Client) {
    client.user?.setPresence({
      activities: [
        { name: `${client.stats.members || 'Fetching'} members`, type: 'WATCHING' },
        { name: 'Cat Vibing Meme', type: 'STREAMING', url: `${this.ytURL}NUYvbT6vTPs` },
        { name: `${client.stats.guilds || 'Fetching'} servers`, type: 'PLAYING' },
        { name: 'Wide Putin Walking', type: 'STREAMING', url: `${this.ytURL}SLU3oG_ePhM` },
        { name: `${client.stats.channels || 'Fetching'} channels`, type: 'LISTENING' },
        { name: 'Noisestorm - Crab Rave', type: 'STREAMING', url: `${this.ytURL}LDU_Txk06tM` },
        { name: 'National Anthem of USSR', type: 'STREAMING', url: `${this.ytURL}U06jlgpMtQs` },
        { name: 'Rick Astley - Never Gonna Give You Up', type: 'STREAMING', url: `${this.ytURL}dQw4w9WgXcQ` },
      ],
    });

    await this.util.waitAsync(10000 * this.util.mathRandom(6, 1));

    this.setPresence(client);
  }
}