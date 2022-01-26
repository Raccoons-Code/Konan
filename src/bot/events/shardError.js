const { Event } = require('../classes');

module.exports = class extends Event {
  constructor(...args) {
    super(...args, {
      name: 'shardError',
    });
  }

  async execute(error, shardId) {
    console.error('A websocket connection encountered an error:', error, '\nshardId:', shardId);
  }
};