import { EmojiIdentifierResolvable, MessageButton, Util } from 'discord.js';

class ComponentLink {
  static button({ emoji, label, url }: { emoji?: EmojiIdentifierResolvable, label: string, url: string }) {
    emoji = <EmojiIdentifierResolvable>(emoji ? Util.resolvePartialEmoji(emoji) : null);

    return new MessageButton()
      .setEmoji(emoji)
      .setLabel(label)
      .setStyle('LINK')
      .setURL(`https://${url}`);
  }
}

export { ComponentLink };
