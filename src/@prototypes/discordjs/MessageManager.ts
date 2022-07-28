import { MessageManager } from 'discord.js';

MessageManager.prototype.safeFetch = async function (options) {
  return this.fetch(options).catch(() => null);
};