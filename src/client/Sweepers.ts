import { SweeperOptions } from 'discord.js';

export const sweepers: SweeperOptions = {
  bans: {
    filter: () => () => true,
    interval: 14400,
  },
  emojis: {
    filter: () => () => true,
    interval: 14400,
  },
  invites: {
    lifetime: 3600,
    interval: 14400,
  },
  guildMembers: {
    filter: () => () => true,
    interval: 14400,
  },
  presences: {
    filter: () => () => true,
    interval: 14400,
  },
  messages: {
    lifetime: 3600,
    interval: 14400,
  },
  reactions: {
    filter: () => () => true,
    interval: 14400,
  },
  stageInstances: {
    filter: () => () => true,
    interval: 14400,
  },
  stickers: {
    filter: () => () => true,
    interval: 14400,
  },
  threadMembers: {
    filter: () => () => true,
    interval: 14400,
  },
  threads: {
    lifetime: 3600,
    interval: 14400,
  },
  voiceStates: {
    filter: () => () => true,
    interval: 14400,
  },
};