import { GuildEmoji } from 'discord.js';
import { Event } from '../structures';

export default class EmojiCreate extends Event<'emojiCreate'> {
  constructor() {
    super({
      name: 'emojiCreate',
    });
  }

  async execute(emoji: GuildEmoji) {
    emoji.client.stats.fetch({ filter: 'emojis' });
  }
}