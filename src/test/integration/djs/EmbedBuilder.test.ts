import { EmbedBuilder, Colors } from 'discord.js';
import assert from 'node:assert';

{
  assert.ok(new EmbedBuilder(), 'EmbedBuilder does not exist.');
}

const embed = new EmbedBuilder();

{
  assert.ok(embed.setAuthor(null), 'EmbedBuilder null author');
  assert.ok(embed.setColor(null), 'EmbedBuilder null color');
  assert.ok(embed.setDescription(null), 'EmbedBuilder null description');
  assert.ok(embed.setFields([]), 'EmbedBuilder null fields');
  assert.ok(embed.setFooter(null), 'EmbedBuilder null footer');
  assert.ok(embed.setImage(null), 'EmbedBuilder null image');
  assert.ok(embed.setThumbnail(null), 'EmbedBuilder null thumbnail');
  assert.ok(embed.setTimestamp(null), 'EmbedBuilder null timestamp');
  assert.ok(embed.setTitle(null), 'EmbedBuilder null title');
  assert.ok(embed.setURL(null), 'EmbedBuilder null url');
}

{
  assert.ok(embed.setAuthor({ name: 'n' }), 'EmbedBuilder author name');
  assert.ok(embed.setAuthor({ name: 'n', iconURL: 'https://example.com' }), 'EmbedBuilder author iconURL');
  assert.ok(embed.setAuthor({ name: 'n', url: 'https://example.com' }), 'EmbedBuilder author url');
  assert.ok(embed.setColor('#000'), 'EmbedBuilder 3 hex color');
  assert.ok(embed.setColor('#000000'), 'EmbedBuilder 6 hex color');
  assert.ok(embed.setColor('DarkRed'), 'EmbedBuilder color name');
  assert.ok(embed.setColor(Colors.DarkRed), 'EmbedBuilder djs Colors');
  assert.ok(embed.setDescription('d'), 'EmbedBuilder description');
  assert.ok(embed.setFields([{ name: 'n', value: 'v' }]), 'EmbedBuilder fields');
  assert.ok(embed.setFields([{ name: 'n', value: 'v', inline: true }]), 'EmbedBuilder fields inline');
  assert.ok(embed.setFooter({ text: 't' }), 'EmbedBuilder footer text');
  assert.ok(embed.setFooter({ text: 't', iconURL: 'https://example.com' }), 'EmbedBuilder footer iconURL');
  assert.ok(embed.setImage('https://example.com'), 'EmbedBuilder image');
  assert.ok(embed.setThumbnail('https://example.com'), 'EmbedBuilder thumbnail');
  assert.ok(embed.setTimestamp(), 'EmbedBuilder empty timestamp');
  assert.ok(embed.setTimestamp(Date.now()), 'EmbedBuilder timestamp');
  assert.ok(embed.setTimestamp(new Date()), 'EmbedBuilder timestamp date');
  assert.ok(embed.setTitle('t'), 'EmbedBuilder title');
  assert.ok(embed.setURL('https://example.com'), 'EmbedBuilder url');
}

{
  assert.throws(() => embed.setAuthor({ name: '' }), 'Empty author name');
  assert.throws(() => embed.setAuthor({ name: 'n', iconURL: '' }), 'Empty author iconURL');
  assert.throws(() => embed.setAuthor({ name: 'n', iconURL: 'i.com' }), 'Invalid author iconURL');
  assert.throws(() => embed.setAuthor({ name: 'n', url: '' }), 'Empty author url');
  assert.throws(() => embed.setAuthor({ name: 'n', url: 'u.com' }), 'Invalid author url');
  assert.throws(() => embed.setColor('#'), 'Empty color');
  assert.throws(() => embed.setDescription(''), 'Empty description');
  assert.throws(() => embed.setFields([{ name: '', value: 'v' }]), 'Empty field name');
  assert.throws(() => embed.setFields([{ name: 'n', value: '' }]), 'Empty field value');
  assert.throws(() => embed.setFooter({ text: '' }), 'Empty footer text');
  assert.throws(() => embed.setFooter({ text: 'n', iconURL: '' }), 'Empty footer iconURL');
  assert.throws(() => embed.setFooter({ text: 'n', iconURL: 'i.com' }), 'Invalid footer iconURL');
  assert.throws(() => embed.setImage(''), 'Empty image');
  assert.throws(() => embed.setImage('i.com'), 'Invalid image');
  assert.throws(() => embed.setThumbnail(''), 'Empty thumbnail');
  assert.throws(() => embed.setThumbnail('t.com'), 'Invalid thumbnail');
  assert.throws(() => embed.setTitle(''), 'Empty title');
  assert.throws(() => embed.setURL(''), 'Empty url');
  assert.throws(() => embed.setURL('u.com'), 'Invalid url');
}
