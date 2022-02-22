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
      this.client = client;
      this.prisma = client.prisma;
      this.t = client.t;
      this.util = client.util;
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