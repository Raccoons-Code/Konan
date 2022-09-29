import { ActivitiesOptions, ActivityType, Client, Guild, OAuth2Scopes } from 'discord.js';
import { env } from 'node:process';
import { setTimeout as waitAsync } from 'node:timers/promises';
import commandHandler from '../commands';
import { Event } from '../structures';

const { Listening, Playing, Streaming, Watching } = ActivityType;
const { ApplicationsCommands, Bot } = OAuth2Scopes;

export default class Ready extends Event<'ready'> {
  constructor() {
    super({
      name: 'ready',
      listener: 'once',
      intents: ['GuildPresences'],
    });
  }

  async execute(client: Client) {
    console.log(`Ready! ${client.user?.tag} is on ${client.guilds.cache.size} servers.`);

    client.application?.fetch();
    client.application?.commands.fetch();

    client.invite = client.generateInvite({
      scopes: [ApplicationsCommands, Bot],
      permissions: commandHandler.permsBitfield,
    });

    client.stats.fetch();

    /* client.topggAutoposter(); */
    this.logCommandsErrors(client);
    this.setPresenceInterval(client);
  }

  async logCommandsErrors(client: Client) {
    if (env.NODE_ENV === 'production')
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
    const activities: ActivitiesOptions[] = [
      { name: 'Cat Vibing Meme', type: Streaming, url: ytURL('NUYvbT6vTPs') },
      { name: 'Wide Putin Walking', type: Streaming, url: ytURL('SLU3oG_ePhM') },
      { name: 'Noisestorm - Crab Rave', type: Streaming, url: ytURL('LDU_Txk06tM') },
      { name: 'National Anthem of USSR', type: Streaming, url: ytURL('U06jlgpMtQs') },
      { name: 'Rick Astley - Never Gonna Give You Up', type: Streaming, url: ytURL('dQw4w9WgXcQ') },
    ];

    if (client.stats.guilds)
      activities.push(
        { name: `${client.stats.members} members`, type: Listening },
        { name: `${client.stats.guilds} servers`, type: Playing },
        { name: `${client.stats.channels} channels`, type: Watching },
      );

    client.user?.setPresence({ activities });
  }

  async setPresenceInterval(client: Client) {
    this.setPresence(client);
    await waitAsync(10000 * this.Util.mathRandom(6, 1));
    this.setPresenceInterval(client);
  }
}

function ytURL<s extends string>(s: s): `https://www.youtube.com/watch?v=${s}` {
  return `https://www.youtube.com/watch?v=${s}`;
}