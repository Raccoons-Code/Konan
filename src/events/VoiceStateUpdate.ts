import { VoiceState } from 'discord.js';
import { Client, Event } from '../structures';

export default class VoiceStateUpdate extends Event {
  constructor(client: Client) {
    super(client, {
      intents: ['GUILD_VOICE_STATES'],
      name: 'voiceStateUpdate',
    });
  }

  async execute(oldState: VoiceState, newState: VoiceState) { }
}