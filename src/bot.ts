import './@prototypes';
import { client } from './client';

client.login();

setTimeout(() => process.exit(0), 1000 * 60 * 60);