import { SelectMenuOptionBuilder } from 'discord.js';
import assert from 'node:assert';

{
  assert.ok(new SelectMenuOptionBuilder(), 'SelectMenuOptionBuilder does not exist.');
}

const selectMenuOption = new SelectMenuOptionBuilder();

{
  assert.ok(selectMenuOption.setDefault(true), 'SelectMenuOptionBuilder setDefault');
  assert.ok(selectMenuOption.setLabel('a'), 'SelectMenuOptionBuilder setLabel');
  assert.ok(selectMenuOption.setValue('a'), 'SelectMenuOptionBuilder setValue');
}

{
  assert.throws(() => selectMenuOption.setDescription(''), 'SelectMenuOptionBuilder empty description');
  assert.throws(() => selectMenuOption.setDescription(null!), 'SelectMenuOptionBuilder empty description');
}