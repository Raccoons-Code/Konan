import { Client } from "discord.js";
import ApplicationOwners from "./ApplicationOwners";
import ApplicationStats from "./ApplicationStats";
import PresenceManager from "./PresenceManager";
import WebhookLogger from "./WebhookLogger";

const client = new Client({
  intents: 0,
  failIfNotExists: false,
});

export default client;

export const appOwners = new ApplicationOwners();
export const appStats = new ApplicationStats();
export const logger = new WebhookLogger();
export const presence = new PresenceManager();
