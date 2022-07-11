import { ActivityType, Client, Guild, OAuth2Scopes } from 'discord.js';
import { env } from 'node:process';
import { setTimeout as waitAsync } from 'node:timers/promises';
import Deploy from '../client/Deploy';
import commandHandler from '../commands';
import { Event } from '../structures';

const deployCommands = new Deploy();
const { NODE_ENV } = env;
const { Listening, Playing, Streaming, Watching } = ActivityType;
const { ApplicationsCommands, Bot } = OAuth2Scopes;

export default class Ready extends Event {
  constructor() {
    super({
      name: 'ready',
      listener: 'once',
    });
  }

  async execute(client: Client) {
    console.log(`Ready! ${client.user?.tag} is on ${client.guilds.cache.size} servers.`);

    await commandHandler.loadCommands();

    client.application?.fetch();

    client.invite = client.generateInvite({
      scopes: [ApplicationsCommands, Bot],
      permissions: BigInt(545460321791),
    });

    await client.stats.fetch();
    this.setPresence(client);
    client.topggAutoposter();
    this.logCommandsErrors(client);

    if (NODE_ENV === 'production')
      deployCommands.online(client);
  }

  async logCommandsErrors(client: Client) {
    if (NODE_ENV === 'production')
      for (let i = 0; i < commandHandler.errors.length; i++) {
        client.sendError(commandHandler.errors[i]);
      }

    if (commandHandler.errors.length)
      console.error(commandHandler.errors.splice(0, commandHandler.errors.length).join('\n'));
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
        { name: `${client.stats.members || 'Fetching'} members`, type: Watching },
        { name: 'Cat Vibing Meme', type: Streaming, url: ytURL('NUYvbT6vTPs') },
        { name: `${client.stats.guilds || 'Fetching'} servers`, type: Playing },
        { name: 'Wide Putin Walking', type: Streaming, url: ytURL('SLU3oG_ePhM') },
        { name: `${client.stats.channels || 'Fetching'} channels`, type: Listening },
        { name: 'Noisestorm - Crab Rave', type: Streaming, url: ytURL('LDU_Txk06tM') },
        { name: 'National Anthem of USSR', type: Streaming, url: ytURL('U06jlgpMtQs') },
        { name: 'Rick Astley - Never Gonna Give You Up', type: Streaming, url: ytURL('dQw4w9WgXcQ') },
      ],
    });

    await waitAsync(10000 * this.Util.mathRandom(6, 1));

    this.setPresence(client);
  }
}

function ytURL<s extends string>(s: s): `https://www.youtube.com/watch?v=${s}` {
  return `https://www.youtube.com/watch?v=${s}`;
}