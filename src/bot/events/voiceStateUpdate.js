const { Event } = require('../classes');

module.exports = class extends Event {
  constructor(...args) {
    super(...args, {
      intents: ['GUILD_VOICE_STATES'],
      name: 'voiceStateUpdate',
    });
  }

  async execute(oldState, newState) {
    return;
  }
};