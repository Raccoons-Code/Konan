import { GuildEmoji } from 'discord.js';
import { Event } from '../structures';

export default class EmojiDelete extends Event<'emojiDelete'> {
  constructor() {
    super({
      name: 'emojiDelete',
    });
  }

  async execute(emoji: GuildEmoji) {
    emoji.client.stats.fetch({ filter: 'emojis' });
  }
}