const { Event } = require('../classes');

module.exports = class extends Event {
  constructor(client) {
    super(client, {
      intents: ['GUILD_VOICE_STATES'],
      name: 'voiceStateUpdate',
    });
  }

  async execute(oldState, newState) {
    return;
  }
};