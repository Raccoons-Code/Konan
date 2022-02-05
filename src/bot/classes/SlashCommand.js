const { SlashCommandBuilder } = require('@discordjs/builders');
const { AutocompleteInteraction, ButtonInteraction, CommandInteraction, DMChannel, Guild, GuildChannel, Message, MessageActionRow, MessageSelectOptionData } = require('discord.js');
const Client = require('./client');

module.exports = class extends SlashCommandBuilder {
  /** @param {Client} client */
  constructor(client) {
    super();
    this.labelRegex = /(.{1,90})/;
    this.limitRegex = /(.{1,100})/;
    this.messageURLRegex = /(?:(?:\/)?(\d+))+/;
    this.textRegexp = /(?:(?:([^|]{0,256}))(?:\|?(.{0,4096})))/;
    if (client?.ready) {
      this.client = client;
      this.prisma = client.prisma;
      this.t = client.t;
      this.util = client.util;
    }
  }

  get buttonStyles() {
    return ['DANGER', 'PRIMARY', 'SECONDARY', 'SUCCESS'];
  }

  get randomButtonStyle() {
    return this.buttonStyles[this.util.mathRandom(3, 0)];
  }

  async execute() {
    /** @type {AutocompleteInteraction} */
    this.AutocompleteInteraction;
    /** @type {ButtonInteraction} */
    this.ButtonInteraction;
    /** @type {CommandInteraction} */
    this.CommandInteraction;
    /** @type {DMChannel} */
    this.DMChannel;
    /** @type {GuildChannel} */
    this.GuildChannel;
    /** @type {Guild} */
    this.Guild;
    /** @type {Message} */
    this.Message;
    /** @type {MessageActionRow} */
    this.MessageActionRow;
    /** @type {MessageSelectOptionData} */
    this.MessageSelectOptionData;
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
   * @param {GuildChannel} channel
   * @param {string} id
   * @return {Promise<Message>}
   */
  async getMessageById(channel, id) {
    return channel.messages.resolve(id) || await channel.messages.fetch(id);
  }
};