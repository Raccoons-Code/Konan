const { MessageEmbed } = require('discord.js');
const { SlashCommand } = require('../../classes');

module.exports = class extends SlashCommand {
  constructor(...args) {
    super(...args);
    this.data = this.setName('jankenpon')
      .setDescription('jankenpon')
      .setDefaultPermission(false)
      .addSubcommandGroup(subcommandgroup => subcommandgroup.setName('game')
        .setDescription('jankenpon')
        .addSubcommand(subcommand => subcommand.setName('single')
          .setDescription('Single player')
          .addStringOption(option => option.setName('jankenpon')
            .setDescription('jankenpon')
            .setChoices([['Rock', 'rock'], ['Paper', 'paper'], ['Scissors', 'scissors']])
            .setRequired(true))))
      .addSubcommandGroup(subcommandgroup => subcommandgroup.setName('spock')
        .setDescription('jankenpon')
        .addSubcommand(subcommand => subcommand.setName('single')
          .setDescription('Single player')
          .addStringOption(option => option.setName('jankenpon')
            .setDescription('jankenpon')
            .setChoices([['Rock', 'rock'], ['Paper', 'paper'], ['Scissors', 'scissors'], ['Lizard', 'lizard'], ['Spock', 'spock']])
            .setRequired(true))));
  }

  async execute(interaction = this.CommandInteraction) {
    const { options } = interaction;

    const subcommand = options.getSubcommandGroup();

    this[subcommand]?.(interaction);
  }

  async game(interaction = this.CommandInteraction) {
    const { member, options, user } = interaction;

    const name = member?.nickname || user.username;

    const subcommand = options.getSubcommand();
    const jankenpon = options.getString('jankenpon');

    const embeds = [new MessageEmbed().setColor('RANDOM')
      .setTitle('Jankenpon')];

    if (subcommand === 'single') {
      const result = this.util.jankenpon.game(jankenpon);

      embeds[0].addFields([{ name, value: result.player1, inline: true },
      { name: 'Result', value: result.result, inline: true },
      { name: 'Machine', value: result.player2, inline: true }]);

      return interaction.reply({ embeds });
    }
  }

  async spock(interaction = this.CommandInteraction) {
    const { member, options, user } = interaction;

    const name = member?.nickname || user.username;

    const subcommand = options.getSubcommand();
    const jankenpon = options.getString('jankenpon');

    const embeds = [new MessageEmbed().setColor('RANDOM')
      .setTitle('Jankenpon')];

    if (subcommand === 'single') {
      const result = this.util.jankenpon.spock(jankenpon);

      embeds[0].addFields([{ name, value: result.player1, inline: true },
      { name: 'Result', value: result.result, inline: true },
      { name: 'Machine', value: result.player2, inline: true }]);

      return interaction.reply({ embeds });
    }
  }
};