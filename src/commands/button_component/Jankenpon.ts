import { userMention } from '@discordjs/builders';
import { ButtonInteraction, Client } from 'discord.js';
import { QuickDB } from 'quick.db';
import { JkpCustomId, JKPGameData } from '../../@types';
import JKP from '../../JKP';
import { ButtonComponentInteraction } from '../../structures';

const quickDb = new QuickDB();

export default class Jankenpon extends ButtonComponentInteraction {
  constructor(client: Client) {
    super(client, {
      name: 'jankenpon',
      description: 'Jankenpon',
    });
  }

  async execute(interaction: ButtonInteraction<'cached'>) {
    const { customId, message, user } = interaction;

    const parsedCustomId = <JkpCustomId>JSON.parse(customId);

    const { p, v } = parsedCustomId;

    const players = p.reduce((acc, value, i) => {
      if (value === user.id) {
        acc.player1 = user.id;
        acc.changed = i;

        return acc;
      }

      acc.player2 = p[i];

      return acc;
    }, <{ [k: string]: any }>{});

    if (!await quickDb.has(`${message.id}`))
      await quickDb.set(`${message.id}`, { [user.id]: v, p });

    const { player2 } = players;

    if (await quickDb.get(`${message.id}.${player2}`))
      return await quickDb.set(`${message.id}.${user.id}`, v) && this.mathPoint(interaction, players, parsedCustomId);

    await quickDb.set(`${message.id}.${user.id}`, v);

    await interaction.deferUpdate();
  }

  async mathPoint(
    interaction: ButtonInteraction<'cached'>,
    players: { [k: string]: any },
    parsedCustomId: JkpCustomId,
  ) {
    const { message } = interaction;

    const { changed, player1, player2 } = players;

    const values = await quickDb.get<JKPGameData>(`${message.id}`);

    const value1 = values![player1];
    const value2 = values![player2];
    const result = JKP.spock(value1, value2);

    message.embeds.map(embed => {
      embed.fields = embed.fields?.map((field, i) => {
        const { name, value } = field;

        if (name === 'Result') {
          field.value = `${userMention(player1)} ${result.result}`;

          return field;
        }

        if (result.res === 1 ? changed ? i === 2 : i === 0 : false) {
          field.value = `${parseInt(value) + 1}`;

          return field;
        }

        if (result.res === 2 ? changed ? i === 0 : i === 2 : false) {
          field.value = `${parseInt(value) + 1}`;

          return field;
        }

        return field;
      });

      embed.setColor('RANDOM');

      return embed;
    });

    await quickDb.delete(`${message.id}`);

    message.components.map(row => {
      if (row.components[0].type !== 'BUTTON') return row;

      row.components.map(button => {
        if (button.type !== 'BUTTON' || !button.customId) return button;

        const { p, v } = parsedCustomId;

        button.setCustomId(JSON.stringify({ c: 'jkp', p, v }));

        return button;
      });

      return row;
    });

    return interaction.update({ components: message.components, embeds: message.embeds });
  }
}