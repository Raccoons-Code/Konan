const { Event } = require('../classes');

module.exports = class extends Event {
  constructor(client) {
    super(client, {
      name: 'error',
    });
  }

  async execute(error) {
    console.error(error);
  }
};