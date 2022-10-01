import { GuildEmoji } from 'discord.js';
import { appStats } from '../client';
import { Event } from '../structures';

export default class EmojiDelete extends Event<'emojiDelete'> {
  constructor() {
    super({
      name: 'emojiDelete',
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(emoji: GuildEmoji) {
    appStats.fetch({ filter: 'emojis' });
  }
}