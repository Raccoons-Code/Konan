import Client from './Client';
import WebhookLogger from './WebhookLogger';


const client = Client.init();
const logger = new WebhookLogger();

export { client, logger };
