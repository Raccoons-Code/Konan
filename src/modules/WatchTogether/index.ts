import { DiscordTogether } from 'discord-together';
import { client } from '../../client';

class WatchTogether {
  discordTogether!: DiscordTogether<Record<string, string>>;
  applications!: (keyof DiscordTogether<Record<string, string>>['applications'])[];

  constructor() {
    this.discordTogether = new DiscordTogether(<any>client);
    this.applications = Object.keys(this.discordTogether.applications);
    client.discordTogether = this.discordTogether;
  }
}

const watchTogether = new WatchTogether();

export default watchTogether;
export { watchTogether };
