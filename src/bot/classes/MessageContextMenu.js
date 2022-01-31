const { ContextMenuCommandBuilder } = require('@discordjs/builders');
const { MessageContextMenuInteraction } = require('discord.js');
const Client = require('./client');

module.exports = class extends ContextMenuCommandBuilder {
  /** @param {Client} client */
  constructor(client) {
    super();
    if (client?.ready) {
      this.client = client;
      this.prisma = client.prisma;
      this.t = client.t;
      this.util = client.util;
    }
  }

  async execute() {
    /** @type {MessageContextMenuInteraction} */
    this.MessageContextMenuInteraction;
  }
};