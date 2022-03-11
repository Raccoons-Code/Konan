const { ContextMenuCommandBuilder } = require('@discordjs/builders');
const { MessageContextMenuInteraction } = require('discord.js');
const Client = require('./client');

module.exports = class extends ContextMenuCommandBuilder {
  /** @param {Client} client */
  constructor(client) {
    super();
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
    /** @type {MessageContextMenuInteraction} */
    this.MessageContextMenuInteraction;
  }
};