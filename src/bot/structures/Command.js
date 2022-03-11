const { Message, PermissionString } = require('discord.js');
const Client = require('./client');

module.exports = class {
  /**
   * @param {Client} client
   * @param {Data} data
   */
  constructor(client, data) {
    if (!this.regexCommandName(data.name))
      return console.error(`Command ${data.name} cannot be loaded.`);

    this.data = data;

    if (client) {
      /** @type {client} */
      this.client;
      /** @type {client['prisma']} */
      this.prisma;
      /** @type {client['regexp']} */
      this.regexp;
      /** @type {client['t']} */
      this.t;
      /** @type {client['translator']} */
      this.translator;
      /** @type {client['util']} */
      this.util;

      Object.defineProperties(this, {
        client: { value: client },
        prisma: { value: client.prisma },
        regexp: { value: client.util.regexp },
        t: { value: client.t },
        util: { value: client.util },
      });
    }
  }

  async execute() {
    /** @type {Message} */
    this.Message;
  }

  /**
   * @description delete one message with async timeout delay
   * @param {Seconds<Number>} timeout
   * @async
   */
  async timeout_erase(message, timeout = 0) {
    if (!message) return console.error('Unable to delete undefined message.');
    await this.util.waitAsync(timeout * 1000);
    return await message.delete().catch(() => null);
  }

  /**
   * @param {String} string
   * @return {Boolean}
   */
  regexCommandName(string) {
    return /^[\w-]{1,32}$/.test(string);
  }
};

/**
 * @typedef Data
 * @property {string[]} [aliases]
 * @property {any} [args]
 * @property {PermissionString[]} [clientPermissions]
 * @property {String} description
 * @property {String} [emoji]
 * @property {String} name
 * @property {PermissionString[]} [userPermissions]
 */