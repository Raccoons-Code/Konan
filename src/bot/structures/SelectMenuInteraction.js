const { PermissionString, SelectMenuInteraction } = require('discord.js');
const Client = require('./client');

module.exports = class {
  /**
   * @param {Client} client
   * @param {Data} data
   */
  constructor(client, data) {
    this.data = data;
    if (client?.ready) {
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
    /** @type {SelectMenuInteraction} */
    this.SelectMenuInteraction;
  }
};

/**
 * @typedef Data
 * @property {string} name
 * @property {string} description
 * @property {PermissionString[]} [clientPermissions]
 */