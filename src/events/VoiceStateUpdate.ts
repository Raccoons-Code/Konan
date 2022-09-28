import { VoiceState } from 'discord.js';
import { Event } from '../structures';

export default class VoiceStateUpdate extends Event<'voiceStateUpdate'> {
  constructor() {
    super({
      intents: 'GuildVoiceStates',
      name: 'voiceStateUpdate',
    });
  }

  async execute(oldState: VoiceState, newState: VoiceState) {
    newState.client.stats.fetch({ filter: 'voice_adapters' });
  }
}