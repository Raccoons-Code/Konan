import { VoiceState } from 'discord.js';
import { appStats } from '../client';
import { Event } from '../structures';

export default class VoiceStateUpdate extends Event<'voiceStateUpdate'> {
  constructor() {
    super({
      intents: 'GuildVoiceStates',
      name: 'voiceStateUpdate',
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(oldState: VoiceState, newState: VoiceState) {
    appStats.fetch({ filter: 'voice_adapters' });
  }
}