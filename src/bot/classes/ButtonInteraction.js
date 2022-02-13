const { ButtonInteraction, MessageActionRow, MessageEmbed, MessageSelectOptionData, PermissionString } = require('discord.js');
const Client = require('./client');

module.exports = class {
  /**
   * @param {Client} client
   * @param {object} data
   * @param {string} data.name
   * @param {string} data.description
   * @param {Array<PermissionString>} [data.clientPermissions]
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