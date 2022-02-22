const { ButtonInteraction } = require('../../classes');
const { userMention } = require('@discordjs/builders');

module.exports = class extends ButtonInteraction {
  constructor(client) {
    super(client, {
      name: 'oldjankenpon',
      description: 'Jankenpon',
    });
  }

  async execute(interaction = this.ButtonInteraction) {
    const { customId, member } = interaction;

    const parsedCustomId = JSON.parse(customId);

    if (!RegExp(member.id).test(customId)) return;

    const players = [1, 2].reduce((acc, key, i) => {
      if (parsedCustomId[key][member.id] >= 0) {
        acc.player1 = member.id;
        acc.changed = i;

        return acc;
      }

      acc.player2 = Object.keys(parsedCustomId[key])[0];

      return acc;
    }, {});

    const { changed, player2 } = players;

    if (parsedCustomId[changed ? 1 : 2][player2] > 0)
      return this.mathPoint(interaction, parsedCustomId, players);

    this.setComponents(interaction, parsedCustomId, players);
  }

  setComponents(interaction = this.ButtonInteraction, parsedCustomId, players) {
    const { message } = interaction;

    const components = message.components.map((component = this.MessageActionRow) => {
      component.components = component.components.map(button => {
        const oldCustomId = JSON.parse(button.customId);

        const { changed, player1 } = players;

        oldCustomId[changed ? 2 : 1][player1] = parsedCustomId.v;

        button.customId = JSON.stringify(oldCustomId);

        return button;
      });

      return component;
    });

    interaction.update({ components });
  }

  async mathPoint(interaction = this.ButtonInteraction, parsedCustomId, players) {
    const { message } = interaction;

    const { changed, player1, player2 } = players;

    const value1 = parsedCustomId.v;
    const value2 = parsedCustomId[changed ? 1 : 2][player2];
    const result = this.util.jankenpon.spock(value1, value2);

    const embeds = message.embeds.map((embed = this.MessageEmbed) => {
      embed.fields = embed.fields.map((field, i) => {
        const { name, value } = field;

        if (name === 'Result') {
          field.value = `${userMention(player1)} ${result.result}`;

          return field;
        }

        if (result.result === 'Won' ? changed ? i === 2 : i === 0 : false) {
          field.value = `${parseInt(value) + 1}`;

          return field;
        }

        if (result.result === 'Lost' ? changed ? i === 0 : i === 2 : false) {
          field.value = `${parseInt(value) + 1}`;

          return field;
        }

        return field;
      });

      embed.setColor('RANDOM');

      return embed;
    });

    const components = message.components.map((component = this.MessageActionRow) => {
      component.components = component.components.map(button => {
        const oldCustomId = JSON.parse(button.customId);

        oldCustomId[changed ? 2 : 1][player1] = 0;
        oldCustomId[changed ? 1 : 2][player2] = 0;

        button.customId = JSON.stringify(oldCustomId);

        return button;
      });

      return component;
    });

    interaction.update({ components, embeds });
  }
};