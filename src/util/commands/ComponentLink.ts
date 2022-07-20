import { ButtonBuilder, ButtonStyle, ComponentEmojiResolvable } from 'discord.js';

class ComponentLink {
  static button({ emoji, label, url }: { emoji?: ComponentEmojiResolvable, label: string, url: string }) {
    return new ButtonBuilder()
      .setEmoji(emoji ?? {})
      .setLabel(label)
      .setStyle(ButtonStyle.Link)
      .setURL(`https://${url}`);
  }
}

export { ComponentLink };
