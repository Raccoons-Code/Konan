import { Client, Team } from 'discord.js';
import { env } from 'node:process';

export const getApplicationOwners = new class GetApplicationOwners {
  async getOwners(client: Client) {
    const ownersId = [];

    if (env.OWNER_ID)
      ownersId.push(...env.OWNER_ID.split(','));

    const app = await client.application?.fetch();

    if (!app?.owner) return ownersId;

    if (app.owner instanceof Team)
      ownersId.push(...app.owner.members.keys());

    ownersId.push(app.owner.id);

    return ownersId;
  }
};

export default getApplicationOwners;