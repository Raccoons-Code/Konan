import { ButtonInteraction, EmbedBuilder, userMention } from 'discord.js';
import { QuickDB } from 'quick.db';
import { JkpCustomId, JKPGameData } from '../../@types';
import JKP from '../../JKP';
import { ButtonComponentInteraction } from '../../structures';

const quickDb = new QuickDB();

export default class Jankenpon extends ButtonComponentInteraction {
  constructor() {
    super({
      name: 'jkp',
      description: 'Jankenpon',
    });
  }

  async execute(interaction: ButtonInteraction<'cached'>) {
    const { customId, message, user } = interaction;

    const { p, v } = <JkpCustomId>JSON.parse(customId);

    const players = p.reduce((acc, value, i) => {
      if (value === user.id) {
        acc.player1 = user.id;
        acc.changed = i;

        return acc;
      }

      acc.player2 = p[i];

      return acc;
    }, <Record<string, any>>{});

    if (!await quickDb.has(`${message.id}`))
      await quickDb.set(`${message.id}`, { [user.id]: v });

    const { player2 } = players;

    if (await quickDb.get(`${message.id}.${player2}`))
      return await quickDb.set(`${message.id}.${user.id}`, v) && this.mathPoint(interaction, players);

    await quickDb.set(`${message.id}.${user.id}`, v);

    await interaction.deferUpdate();
  }

  async mathPoint(interaction: ButtonInteraction<'cached'>, players: Record<string, any>) {
    const { message } = interaction;

    const { changed, player1, player2 } = players;

    const values = await quickDb.get<JKPGameData>(`${message.id}`);

    const value1 = values![player1];
    const value2 = values![player2];
    const result = JKP.spock(value1 - 1, value2 - 1);

    message.embeds.map(oldEmbed => {
      if (!oldEmbed.data.fields) return oldEmbed;

      const embed = new EmbedBuilder(oldEmbed.toJSON())
        .setFields(oldEmbed.data.fields.map((field, i) => {
          if (field.name === 'Result') {
            field.value = `${userMention(player1)} ${result.result}`;

            return field;
          }

          if (result.res === 1 ? changed ? i === 2 : i === 0 : false) {
            field.value = `${parseInt(field.value) + 1}`;

            return field;
          }

          if (result.res === 2 ? changed ? i === 0 : i === 2 : false) {
            field.value = `${parseInt(field.value) + 1}`;

            return field;
          }

          return field;
        }))
        .setColor('Random');

      return embed;
    });

    await quickDb.delete(`${message.id}`);

    return interaction.update({ embeds: message.embeds });
  }
}