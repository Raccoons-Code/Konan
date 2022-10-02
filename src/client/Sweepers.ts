import { SweeperOptions } from 'discord.js';

export const sweepers: SweeperOptions = {
  applicationCommands: {
    filter: () => null,
    interval: Infinity,
  },
  bans: {
    filter: () => (value, key, collection) => collection.size > 100,
    interval: 3600,
  },
  emojis: {
    filter: () => (value, key, collection) => collection.size > 100,
    interval: 3600,
  },
  invites: {
    lifetime: 60,
    interval: 3600,
  },
  guildMembers: {
    filter: () => (value, key, collection) => collection.size > 100,
    interval: 3600,
  },
  presences: {
    filter: () => (value, key, collection) => collection.size > 100,
    interval: 3600,
  },
  messages: {
    lifetime: 60,
    interval: 3600,
  },
  reactions: {
    filter: () => (value, key, collection) => collection.size > 100,
    interval: 3600,
  },
  stageInstances: {
    filter: () => (value, key, collection) => collection.size > 100,
    interval: 3600,
  },
  stickers: {
    filter: () => (value, key, collection) => collection.size > 100,
    interval: 3600,
  },
  threadMembers: {
    filter: () => (value, key, collection) => collection.size > 100,
    interval: 3600,
  },
  threads: {
    lifetime: 60,
    interval: 3600,
  },
  voiceStates: {
    filter: () => (value, key, collection) => collection.size > 100,
    interval: 3600,
  },
  users: {
    filter: () => (value, key, collection) => collection.size > 100,
    interval: 3600,
  },
};