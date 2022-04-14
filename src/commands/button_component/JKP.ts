import { userMention } from '@discordjs/builders';
import { ButtonInteraction, MessageEmbed } from 'discord.js';
import db from 'quick.db';
import { JkpCustomId } from '../../@types';
import JKP from '../../JKP';
import { ButtonComponentInteraction, Client } from '../../structures';

export default class Jankenpon extends ButtonComponentInteraction {
  constructor(client: Client) {
    super(client, {
      name: 'jkp',
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

    if (!db.has(`${message.id}`))
      db.set(`${message.id}`, { [user.id]: v, p });

    const { player2 } = players;

    if (db.get(`${message.id}.${player2}`))
      return db.set(`${message.id}.${user.id}`, v) && this.mathPoint(interaction, players);

    db.set(`${message.id}.${user.id}`, v);

    await interaction.deferUpdate();
  }

  async mathPoint(interaction: ButtonInteraction<'cached'>, players: { [k: string]: any }) {
    const { message } = interaction;

    const { changed, player1, player2 } = players;

    const values = db.get(`${message.id}`);

    const value1 = values[player1];
    const value2 = values[player2];
    const result = JKP.spock(value1, value2);

    message.embeds.map(embed => {
      embed.fields.map((field, i) => {
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

    db.delete(`${message.id}`);

    await interaction.update({ embeds: message.embeds });
  }
}