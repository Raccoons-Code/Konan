const { Command } = require('../../classes');
const { env: { OWNER_ID } } = process;

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: 'throw',
      description: 'throw new error',
      args: ['error'],
    });
  }

  async execute(message = this.Message) {
    const { args, author } = message;

    if (!OWNER_ID?.split(',').includes(author.id)) return;

    throw Error(args.join(' '));
  }
};