import { StageInstance } from 'discord.js';
import { Event } from '../structures';

export default class StageInstanceCreate extends Event<'stageInstanceCreate'> {
  constructor() {
    super({
      name: 'stageInstanceCreate',
    });
  }

  async execute(stageInstance: StageInstance) {
    stageInstance.client.stats.fetch({ filter: 'guilds' });
  }
}