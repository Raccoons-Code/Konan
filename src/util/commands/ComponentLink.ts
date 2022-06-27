import { ButtonBuilder, ButtonStyle, EmojiIdentifierResolvable, resolvePartialEmoji } from 'discord.js';

const { Link } = ButtonStyle;

class ComponentLink {
  static button({ emoji, label, url }: { emoji?: EmojiIdentifierResolvable, label: string, url: string }) {
    emoji = <string>(emoji ? resolvePartialEmoji(emoji) : null);

    return new ButtonBuilder()
      .setEmoji(emoji)
      .setLabel(label)
      .setStyle(Link)
      .setURL(`https://${url}`);
  }
}

export { ComponentLink };
