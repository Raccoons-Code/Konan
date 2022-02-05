const { ButtonInteraction } = require('../../classes');
const db = require('quick.db');

module.exports = class extends ButtonInteraction {
  constructor(...args) {
    super(...args);
    this.data = {
      name: 'jankenpon',
      description: 'Jankenpon',
    };
  }

  async execute(interaction = this.ButtonInteraction) {
    const { customId, message, user } = interaction;

    /** @type {customId} */
    const parsedCustomId = this.util.parseJSON(customId);

    const { c, p, v } = parsedCustomId;

    const players = p.reduce((acc, value, i) => {
      if (value === user.id) {
        acc.player1 = user.id;
        acc.changed = i;

        return acc;
      }

      acc.player2 = p[i];

      return acc;
    }, {});

    if (!db.has(`${message.id}`))
      db.set(`${message.id}`, { [user.id]: v, p });

    const { player2 } = players;

    if (db.get(`${message.id}.${player2}`))
      return db.set(`${message.id}.${user.id}`, v) && this.mathPoint(interaction, parsedCustomId, players);

    db.set(`${message.id}.${user.id}`, v);

    interaction.deferUpdate();
  }

  async mathPoint(interaction = this.ButtonInteraction, parsedCustomId, players) {
    const { message } = interaction;

    const { p } = parsedCustomId;

    const { changed, player1, player2 } = players;

    const values = db.get(`${message.id}`);

    const value1 = values[player1];
    const value2 = values[player2];
    const result = this.util.jankenpon.spock(value1, value2);

    console.log(result, value1, value2, changed);

    const embeds = message.embeds.map((embed = this.MessageEmbed) => {
      embed.fields = embed.fields.map((field, i) => {
        const { name, value } = field;

        if (name === 'Result') {
          field.value = `<@${player1}> ${result.result}`;

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

    interaction.update({ embeds });
  }
};

/**
 * @typedef customId
 * @property {string} c command
 * @property {array} p players id
 * @property {number} v value
 */