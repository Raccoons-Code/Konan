const { ButtonInteraction, MessageActionRow, MessageEmbed, MessageSelectOptionData, PermissionString } = require('discord.js');
const Client = require('./client');

module.exports = class {
  /**
   * @param {Client} client
   * @param {Data} data
   */
  constructor(client, data) {
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
        t: { value: client.translator.t },
        util: { value: client.util },
      });
    }
  }

  async execute() {
    /** @type {ButtonInteraction} */
    this.ButtonInteraction;
    /** @type {MessageActionRow} */
    this.MessageActionRow;
    /** @type {MessageEmbed} */
    this.MessageEmbed;
    /** @type {MessageSelectOptionData} */
    this.MessageSelectOptionData;
  }
};

/**
 * @typedef Data
 * @property {string} name
 * @property {string} description
 * @property {PermissionString[]} clientPermissions
 */