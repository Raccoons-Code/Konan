const { AutocompleteInteraction, ButtonInteraction, ClientEvents, CommandInteraction, DMChannel, Guild, GuildBan, GuildChannel, GuildEmoji, GuildMember, GuildScheduledEvent, IntentsString, Interaction, Invite, Message, MessageContextMenuInteraction, MessageReaction, NewsChannel, PartialTypes, PermissionString, Presence, RateLimitData, Role, SelectMenuInteraction, StageInstance, Sticker, ThreadChannel, Typing, User, UserContextMenuInteraction, VoiceState } = require('discord.js');
const Client = require('./client');

module.exports = class {
	/**
	 * @param {Client} client
	 * @param {object} data
	 * @param {Array<IntentsString>} [data.intents]
	 * @param {keyof({on,once})} [data.listener]
	 * @param {keyof(ClientEvents)} data.name
	 * @param {Array<PartialTypes>} [data.partials]
	 * @param {Array<PermissionString>} [data.permissions]
	 */
	constructor(client, {
		intents,
		listener,
		name,
		partials,
		permissions,
	}) {
		this.intents = intents;
		this.listener = listener?.match(/(on(?:ce)?)/)[1] || 'on';
		this.name = name;
		this.partials = partials;
		this.permissions = permissions;
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
		/** @type {CommandInteraction} */
		this.CommandInteraction;
		/** @type {DMChannel} */
		this.DMChannel;
		/** @type {Guild} */
		this.Guild;
		/** @type {GuildBan} */
		this.GuildBan;
		/** @type {GuildChannel} */
		this.GuildChannel;
		/** @type {GuildEmoji} */
		this.GuildEmoji;
		/** @type {GuildMember} */
		this.GuildMember;
		/** @type {GuildScheduledEvent} */
		this.GuildScheduledEvent;
		/** @type {Interaction} */
		this.Interaction;
		/** @type {Invite} */
		this.Invite;
		/** @type {Message} */
		this.Message;
		/** @type {MessageContextMenuInteraction} */
		this.MessageContextMenuInteraction;
		/** @type {MessageReaction} */
		this.MessageReaction;
		/** @type {NewsChannel} */
		this.NewsChannel;
		/** @type {Presence} */
		this.Presence;
		/** @type {RateLimitData} */
		this.RateLimitData;
		/** @type {Role} */
		this.Role;
		/** @type {SelectMenuInteraction} */
		this.SelectMenuInteraction;
		/** @type {StageInstance} */
		this.StageInstance;
		/** @type {Sticker} */
		this.Sticker;
		/** @type {ThreadChannel} */
		this.ThreadChannel;
		/** @type {Typing} */
		this.Typing;
		/** @type {User} */
		this.User;
		/** @type {UserContextMenuInteraction} */
		this.UserContextMenuInteraction;
		/** @type {VoiceState} */
		this.VoiceState;
	}
};