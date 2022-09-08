import { ButtonBuilder, ButtonStyle } from 'discord.js';
import assert from 'node:assert';

{
  assert.ok(new ButtonBuilder(), 'ButtonBuilder does not exist.');
}

const button = new ButtonBuilder();

{
  assert.ok(button.setDisabled(), 'ButtonBuilder undefined disabled');
  assert.ok(button.setEmoji({}), 'ButtonBuilder empty object emoji');
  assert.ok(button.setEmoji('a'), 'ButtonBuilder emoji');
  assert.ok(button.setLabel('a'), 'ButtonBuilder label');
  assert.ok(button.setStyle(ButtonStyle.Link), 'ButtonBuilder style link');
  assert.ok(button.setURL('https://discord.com'), 'ButtonBuilder URL');
}

{
  assert.throws(() => button.setCustomId(''), 'ButtonBuilder empty customId');
  assert.throws(() => button.setEmoji(''), 'ButtonBuilder empty string emoji');
  assert.throws(
    () => button.setLabel('123456789012345678901234567890123456789012345678901234567890123456789012345678901'),
    'ButtonBuilder label length 81',
  );
}