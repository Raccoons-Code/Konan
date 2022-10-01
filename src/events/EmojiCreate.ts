import { GuildEmoji } from 'discord.js';
import { appStats } from '../client';
import { Event } from '../structures';

export default class EmojiCreate extends Event<'emojiCreate'> {
  constructor() {
    super({
      intents: 'GuildEmojisAndStickers',
      name: 'emojiCreate',
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(emoji: GuildEmoji) {
    appStats.fetch({ filter: 'emojis' });
  }
}