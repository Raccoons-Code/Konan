import ApplicationOwners from './ApplicationOwners';
import ApplicationStats from './ApplicationStats';
import Client from './Client';
import WebhookLogger from './WebhookLogger';

export const client = Client.init();
export const appOwners = new ApplicationOwners(client);
export const appStats = new ApplicationStats(client);
export const logger = new WebhookLogger();
