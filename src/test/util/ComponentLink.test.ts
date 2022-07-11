import { ButtonBuilder, ButtonStyle, ComponentEmojiResolvable, parseEmoji, resolvePartialEmoji } from 'discord.js';
import assert from 'node:assert';
import Util from './util';

{
  const params = {
    label: 'apple',
    url: 'apple.com',
  };

  const button = new ButtonBuilder({
    label: params.label,
    emoji: <ComponentEmojiResolvable>parseEmoji(''),
    style: ButtonStyle.Link,
    type: 2,
    url: `https://${params.url}`,
  });

  assert.deepStrictEqual(Util.ComponentLink.button(params), button);
}

{
  const params = {
    emoji: '🍎',
    label: 'apple',
    url: 'apple.com',
  };

  const button = new ButtonBuilder({
    label: params.label,
    emoji: <ComponentEmojiResolvable>resolvePartialEmoji(params.emoji),
    style: ButtonStyle.Link,
    type: 2,
    url: `https://${params.url}`,
  });

  assert.deepStrictEqual(Util.ComponentLink.button(params), button);
}