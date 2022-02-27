const { SlashCommandBuilder } = require('@discordjs/builders');
const { AutocompleteInteraction, ButtonInteraction, CommandInteraction, Constants, DMChannel, Guild, GuildChannel, Message, MessageActionRow, MessageSelectOptionData, PermissionString, TextChannel } = require('discord.js');
const { ChannelTypes } = Constants;
const { GUILD_NEWS, GUILD_NEWS_THREAD, GUILD_PRIVATE_THREAD, GUILD_PUBLIC_THREAD, GUILD_STORE, GUILD_TEXT } = ChannelTypes;
const Client = require('./client');

module.exports = class extends SlashCommandBuilder {
  /**
   * @param {Client} client
   * @param {Props} props
   */
  constructor(client, props) {
    super();
    this.props = props;
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

  get buttonStyles() {
    return ['DANGER', 'PRIMARY', 'SECONDARY', 'SUCCESS'];
  }

  get ButtonStylesChoices() {
    return this.buttonStyles.map(style => [style, style]);
  }

  get GuildTextChannelTypes() {
    return [GUILD_NEWS, GUILD_NEWS_THREAD, GUILD_PRIVATE_THREAD, GUILD_PUBLIC_THREAD, GUILD_STORE, GUILD_TEXT];
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
    /** @type {TextChannel} */
    this.TextChannel;
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
    return await channel.messages.fetch(id);
  }
};

/**
 * @typedef Props
 * @property {PermissionString[]} [clientPermissions]
 * @property {PermissionString[]} [userPermissions]
 */