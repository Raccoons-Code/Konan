const { ButtonInteraction } = require('discord.js');
const Client = require('./client');

module.exports = class {
  /** @param {Client} client */
  constructor(client) {
    if (client?.ready) {
      this.client = client;
      this.prisma = client.prisma;
      this.t = client.t;
      this.util = client.util;
    }
  }

  async execute() {
    /** @type {ButtonInteraction} */
    this.ButtonInteraction;
  }
};