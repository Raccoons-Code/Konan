const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const { SlashCommand } = require('../../classes');

module.exports = class extends SlashCommand {
  constructor(client) {
    super(client);
    this.data = this.setName('jankenpon')
      .setDescription('jankenpon')
      .addSubcommandGroup(subcommandgroup => subcommandgroup.setName('game')
        .setDescription('jankenpon')
        .addSubcommand(subcommand => subcommand.setName('single')
          .setDescription('Single player')
          .addStringOption(option => option.setName('jankenpon')
            .setDescription('jankenpon')
            .setChoices([['Rock', 'rock'], ['Paper', 'paper'], ['Scissors', 'scissors']])
            .setRequired(true)))
        .addSubcommand(subcommand => subcommand.setName('multiplayer')
          .setDescription('Multiplayer')
          .addUserOption(option => option.setName('user')
            .setDescription('Player 2')
            .setRequired(true))))
      .addSubcommandGroup(subcommandgroup => subcommandgroup.setName('spock')
        .setDescription('jankenpon')
        .addSubcommand(subcommand => subcommand.setName('single')
          .setDescription('Single player')
          .addStringOption(option => option.setName('jankenpon')
            .setDescription('jankenpon')
            .setRequired(true)
            .setChoices([['Rock', 'rock'], ['Paper', 'paper'], ['Scissors', 'scissors'], ['Lizard', 'lizard'], ['Spock', 'spock']])))
        .addSubcommand(subcommand => subcommand.setName('multiplayer')
          .setDescription('Multiplayer')
          .addUserOption(option => option.setName('user')
            .setDescription('Player 2')
            .setRequired(true))));
  }

  async execute(interaction = this.CommandInteraction) {
    const { options } = interaction;

    const subcommand = options.getSubcommandGroup();

    await this[subcommand]?.(interaction);
  }

  async game(interaction = this.CommandInteraction) {
    const { locale, member, options, user } = interaction;

    const name = member?.displayName || user.username;

    const subcommand = options.getSubcommand();
    const jankenpon = options.getString('jankenpon');

    const embeds = [new MessageEmbed().setColor('RANDOM').setTitle('Jankenpon')];

    if (subcommand === 'single') {
      const result = this.util.jankenpon.game(jankenpon);

      embeds[0].addFields([{ name, value: result.p1, inline: true },
      { name: 'Result', value: result.result, inline: true },
      { name: 'Machine', value: result.player2, inline: true }]);

      return await interaction.reply({ embeds });
    }

    if (subcommand === 'multiplayer') {
      if (!interaction.inGuild())
        return await interaction.reply({
          content: this.t('onlyOnServer', { locale }),
          ephemeral: true,
        });

      const player2 = options.getMember('user');

      embeds[0].setDescription(`${user} - ${player2}`)
        .addFields([{ name: `${name}`, value: '0', inline: true },
        { name: 'Result', value: '-', inline: true },
        { name: `${player2.displayName}`, value: '0', inline: true }]);

      const buttons = [new MessageButton().setLabel('Rock').setEmoji('✊').setStyle(this.randomButtonStyle)
        .setCustomId(JSON.stringify({ c: this.data.name, p: [user.id, player2.id], v: 1 })),
      new MessageButton().setLabel('Paper').setEmoji('✋').setStyle(this.randomButtonStyle)
        .setCustomId(JSON.stringify({ c: this.data.name, p: [user.id, player2.id], v: 2 })),
      new MessageButton().setLabel('Scissors').setEmoji('✌️').setStyle(this.randomButtonStyle)
        .setCustomId(JSON.stringify({ c: this.data.name, p: [user.id, player2.id], v: 3 }))];

      const components = [new MessageActionRow().setComponents(buttons)];

      return await interaction.reply({ components, embeds });
    }
  }

  async spock(interaction = this.CommandInteraction) {
    const { locale, member, options, user } = interaction;

    const name = member?.displayName || user.username;

    const subcommand = options.getSubcommand();
    const jankenpon = options.getString('jankenpon');

    const embeds = [new MessageEmbed().setColor('RANDOM')
      .setTitle('Jankenpon')];

    if (subcommand === 'single') {
      const result = this.util.jankenpon.spock(jankenpon);

      embeds[0].addFields([{ name, value: result.p1, inline: true },
      { name: 'Result', value: result.result, inline: true },
      { name: 'Machine', value: result.player2, inline: true }]);

      return await interaction.reply({ embeds });
    }

    if (subcommand === 'multiplayer') {
      if (!interaction.inGuild())
        return await interaction.reply({
          content: this.t('onlyOnServer', { locale }),
          ephemeral: true,
        });

      const player2 = options.getMember('user');

      embeds[0].setDescription(`${user} - ${player2}`)
        .addFields([{ name: `${name}`, value: '0', inline: true },
        { name: 'Result', value: '-', inline: true },
        { name: `${player2.displayName}`, value: '0', inline: true }]);

      const buttons = [new MessageButton().setLabel('Rock').setEmoji('✊').setStyle(this.randomButtonStyle)
        .setCustomId(JSON.stringify({ c: this.data.name, p: [user.id, player2.id], v: 1 })),
      new MessageButton().setLabel('Paper').setEmoji('✋').setStyle(this.randomButtonStyle)
        .setCustomId(JSON.stringify({ c: this.data.name, p: [user.id, player2.id], v: 2 })),
      new MessageButton().setLabel('Scissors').setEmoji('✌️').setStyle(this.randomButtonStyle)
        .setCustomId(JSON.stringify({ c: this.data.name, p: [user.id, player2.id], v: 3 })),
      new MessageButton().setLabel('Lizard').setEmoji('🦎').setStyle(this.randomButtonStyle)
        .setCustomId(JSON.stringify({ c: this.data.name, p: [user.id, player2.id], v: 4 })),
      new MessageButton().setLabel('Spock').setEmoji('🖖').setStyle(this.randomButtonStyle)
        .setCustomId(JSON.stringify({ c: this.data.name, p: [user.id, player2.id], v: 5 }))];

      const components = [new MessageActionRow().setComponents(buttons)];

      return await interaction.reply({ components, embeds });
    }
  }
};