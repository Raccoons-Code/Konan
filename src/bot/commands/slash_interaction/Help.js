const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, MessageActionRow, MessageButton } = require('discord.js');
const { splitSelectMenu } = require('../../methods');

module.exports = class extends SlashCommandBuilder {
  constructor(client) {
    super();
    this.client = client;
    this.data = this.setName('help')
      .setDescription('Replies with Help!');
  }

  /** @param {CommandInteraction} interaction */
  async execute(interaction) {
    this.interaction = interaction;
    await interaction.deferReply({ ephemeral: true, fetchReply: true });

    let index = 0;

    const { channel, client } = interaction;
    const { commands: { slash_interaction } } = client;
    const commands = [];

    slash_interaction.forEach(e => {
      commands.push({
        label: e.data.name,
        value: e.data.name,
        description: e.data.description,
        emoji: null,
        default: false,
      });
    });

    const select_menus = splitSelectMenu(commands);

    const back_button = new MessageButton()
      .setCustomId('back')
      .setDisabled(true)
      .setLabel('Voltar')
      .setStyle('SECONDARY');

    const index_button = new MessageButton()
      .setCustomId('index')
      .setDisabled(true)
      .setLabel(`1 - ${select_menus.length}`)
      .setStyle('SUCCESS');

    const next_button = new MessageButton()
      .setCustomId('next')
      .setDisabled(select_menus.length > 1 ? false : true)
      .setLabel('Próximo')
      .setStyle(select_menus.length > 1 ? 'PRIMARY' : 'SECONDARY');

    const select_row = new MessageActionRow()
      .setComponents([select_menus[index]]);

    const button_row = new MessageActionRow()
      .setComponents(back_button, index_button, next_button);

    const res = await interaction.editReply({ content: 'Help!', components: [select_row, button_row] }).catch(() => null);

    const filter = r => r.message.id === res.id;

    const BUTTON_collector = channel.createMessageComponentCollector({ filter, componentType: 'BUTTON' });

    BUTTON_collector.on('collect', async collected => {
      collected.deferUpdate();
      if (collected.customId === 'back') {
        next_button.setDisabled(false)
          .setStyle('PRIMARY');
        index--;
        index_button.setLabel(`${index + 1} - ${select_menus.length}`);
        if (index == 0)
          back_button.setDisabled(true)
            .setStyle('SECONDARY');
      }
      if (collected.customId === 'next') {
        back_button.setDisabled(false)
          .setStyle('PRIMARY');
        index++;
        index_button.setLabel(`${index + 1} - ${select_menus.length}`);
        if ((index + 2) > select_menus.length)
          next_button.setDisabled(true)
            .setStyle('SECONDARY');
      }
      select_row.setComponents(select_menus[index]);
      await interaction.editReply({ content: 'Help!', components: [select_row, button_row] }).catch(() => null);
    });

    const SELECT_MENU_collector = channel.createMessageComponentCollector({ filter, componentType: 'SELECT_MENU' });

    SELECT_MENU_collector.on('collect', async collected => {
      collected.deferUpdate();
    });
  }
};