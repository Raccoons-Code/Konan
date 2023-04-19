import { Client, GatewayIntentBits, Partials } from "discord.js";
import ApplicationOwners from "./ApplicationOwners";
import ApplicationStats from "./ApplicationStats";
import PresenceManager from "./PresenceManager";
import WebhookLogger from "./WebhookLogger";

const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.Guilds,
  ],
  failIfNotExists: false,
  partials: [
    Partials.Channel,
    Partials.GuildMember,
    Partials.GuildScheduledEvent,
    Partials.Message,
    Partials.Reaction,
    Partials.ThreadMember,
    Partials.User,
  ],
});

export default client;

export const appOwners = new ApplicationOwners();
export const appStats = new ApplicationStats();
export const logger = new WebhookLogger();
export const presence = new PresenceManager();
