import { DiscordTogether } from 'discord-together';
import { client } from '../../client';

class WatchTogether {
  discordTogether!: DiscordTogether<Record<string, string>>;
  applications!: (keyof DiscordTogether<Record<string, string>>['applications'])[];

  constructor() {
    this.discordTogether = new DiscordTogether(client);
    this.applications = Object.keys(this.discordTogether.applications);
  }
}

const watchTogether = new WatchTogether();

export default watchTogether;
export { watchTogether };
