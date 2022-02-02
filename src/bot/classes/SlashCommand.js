const { SlashCommandBuilder } = require('@discordjs/builders');
const { AutocompleteInteraction, ButtonInteraction, CommandInteraction, Guild, GuildChannel } = require('discord.js');
const Client = require('./client');

module.exports = class extends SlashCommandBuilder {
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
    /** @type {AutocompleteInteraction} */
    this.AutocompleteInteraction;
    /** @type {ButtonInteraction} */
    this.ButtonInteraction;
    /** @type {GuildChannel} */
    this.GuildChannel;
    /** @type {CommandInteraction} */
    this.CommandInteraction;
    /** @type {Guild} */
    this.Guild;
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
};