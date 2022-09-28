import { StageInstance } from 'discord.js';
import { Event } from '../structures';

export default class StageInstanceDelete extends Event<'stageInstanceDelete'> {
  constructor() {
    super({
      name: 'stageInstanceDelete',
    });
  }

  async execute(stageInstance: StageInstance) {
    stageInstance.client.stats.fetch({ filter: 'guilds' });
  }
}