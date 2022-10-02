import { LimitedCollection } from 'discord.js';

export const cache = new LimitedCollection({
  maxSize: 100,
  keepOverLimit: (v, k, c) => c.size > 100,
});