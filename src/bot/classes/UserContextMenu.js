const { ContextMenuCommandBuilder } = require('@discordjs/builders');
const { UserContextMenuInteraction } = require('discord.js');
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
    /** @type {UserContextMenuInteraction} */
    this.UserContextMenuInteraction;
  }
};