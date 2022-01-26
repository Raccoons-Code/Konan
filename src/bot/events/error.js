const { Event } = require('../classes');

module.exports = class extends Event {
  constructor(...args) {
    super(...args, {
      name: 'error',
    });
  }

  async execute(error) {
    console.error(error);
  }
};