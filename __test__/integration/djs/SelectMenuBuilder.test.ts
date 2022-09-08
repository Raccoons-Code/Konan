import { SelectMenuBuilder } from 'discord.js';
import assert from 'node:assert';

{
  assert.ok(new SelectMenuBuilder(), 'SelectMenuBuilder does not exist.');
}

const selectMenu = new SelectMenuBuilder();

{
  assert.throws(() => selectMenu.setCustomId(''), 'SelectMenuBuilder empty customId');
}

