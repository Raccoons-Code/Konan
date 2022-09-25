import { Client, Team } from 'discord.js';
import { env } from 'node:process';

export default class ApplicationOwners {
  constructor(private client: Client) { }

  async getOwnersId() {
    const ownersId = [];

    if (env.OWNER_ID)
      ownersId.push(...env.OWNER_ID.split(','));

    const app = await this.client.application?.fetch();

    if (!app?.owner) return ownersId;

    if (app.owner instanceof Team)
      ownersId.push(...app.owner.members.keys());

    ownersId.push(app.owner.id);

    return ownersId;
  }

  async isOwner(userId: string) {
    return this.getOwnersId().then(o => o.includes(userId));
  }
}