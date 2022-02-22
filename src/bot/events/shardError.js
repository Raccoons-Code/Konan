const { Event } = require('../classes');

module.exports = class extends Event {
  constructor(client) {
    super(client, {
      name: 'shardError',
    });
  }

  async execute(error, shardId) {
    console.error('A websocket connection encountered an error:', error, '\nshardId:', shardId);
  }
};