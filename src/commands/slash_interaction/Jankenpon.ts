import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import JKP from '../../JKP';
import { Client, SlashCommand } from '../../structures';

export default class Jankenpon extends SlashCommand {
  emoji: { [k: string]: string } = { rock: '✊', scissors: '✌️', paper: '✋', lizard: '🦎', spock: '🖖' };

  constructor(client: Client) {
    super(client, {
      category: 'Game',
    });

    this.data = new SlashCommandBuilder().setName('jankenpon')
      .setDescription('Play a game of Jankenpon with your friends')
      .setNameLocalizations(this.getLocalizations('jankenponName'))
      .setDescriptionLocalizations(this.getLocalizations('jankenponDescription'))
      .addSubcommandGroup(subcommandgroup => subcommandgroup.setName('game')
        .setDescription('The normal game to play.')
        .setNameLocalizations(this.getLocalizations('jankenponGameName'))
        .setDescriptionLocalizations(this.getLocalizations('jankenponGameDescription'))
        .addSubcommand(subcommand => subcommand.setName('single')
          .setDescription('Human vs machine.')
          .setNameLocalizations(this.getLocalizations('jankenponSingleName'))
          .setDescriptionLocalizations(this.getLocalizations('jankenponSingleDescription'))
          .addStringOption(option => option.setName('jankenpon')
            .setDescription('The jankenpon to play.')
            .setNameLocalizations(this.getLocalizations('jankenponSingleJankenponName'))
            .setDescriptionLocalizations(this.getLocalizations('jankenponSingleJankenponDescription'))
            .setChoices({
              name: 'Rock',
              value: 'rock',
              name_localizations: this.getLocalizations('Rock'),
            }, {
              name: 'Paper',
              value: 'paper',
              name_localizations: this.getLocalizations('Paper'),
            }, {
              name: 'Scissors',
              value: 'scissors',
              name_localizations: this.getLocalizations('Scissors'),
            })
            .setRequired(true)))
        .addSubcommand(subcommand => subcommand.setName('multiplayer')
          .setDescription('Human vs human.')
          .setNameLocalizations(this.getLocalizations('jankenponMultiplayerName'))
          .setDescriptionLocalizations(this.getLocalizations('jankenponMultiplayerDescription'))
          .addUserOption(option => option.setName('opponent')
            .setDescription('Choose your opponent.')
            .setNameLocalizations(this.getLocalizations('jankenponMultiplayerOpponentName'))
            .setDescriptionLocalizations(this.getLocalizations('jankenponMultiplayerOpponentDescription'))
            .setRequired(true))))
      .addSubcommandGroup(subcommandgroup => subcommandgroup.setName('spock')
        .setDescription('A Spock version of Jankenpon.')
        .setNameLocalizations(this.getLocalizations('jankenponSpockName'))
        .setDescriptionLocalizations(this.getLocalizations('jankenponSpockDescription'))
        .addSubcommand(subcommand => subcommand.setName('single')
          .setDescription('Human vs machine.')
          .setNameLocalizations(this.getLocalizations('jankenponSpockSingleName'))
          .setDescriptionLocalizations(this.getLocalizations('jankenponSpockSingleDescription'))
          .addStringOption(option => option.setName('jankenpon')
            .setDescription('The jankenpon to play.')
            .setNameLocalizations(this.getLocalizations('jankenponSpockSingleJankenponName'))
            .setDescriptionLocalizations(this.getLocalizations('jankenponSpockSingleJankenponDescription'))
            .setRequired(true)
            .setChoices({
              name: 'Rock',
              value: 'rock',
              name_localizations: this.getLocalizations('Rock'),
            }, {
              name: 'Paper',
              value: 'paper',
              name_localizations: this.getLocalizations('Paper'),
            }, {
              name: 'Scissors',
              value: 'scissors',
              name_localizations: this.getLocalizations('Scissors'),
            }, {
              name: 'Lizard',
              value: 'lizard',
              name_localizations: this.getLocalizations('Lizard'),
            }, {
              name: 'Spock',
              value: 'spock',
              name_localizations: this.getLocalizations('Spock'),
            })))
        .addSubcommand(subcommand => subcommand.setName('multiplayer')
          .setDescription('Human vs human.')
          .setNameLocalizations(this.getLocalizations('jankenponSpockMultiplayerName'))
          .setDescriptionLocalizations(this.getLocalizations('jankenponSpockMultiplayerDescription'))
          .addUserOption(option => option.setName('opponent')
            .setDescription('Choose your opponent.')
            .setNameLocalizations(this.getLocalizations('jankenponSpockMultiplayerOpponentName'))
            .setDescriptionLocalizations(this.getLocalizations('jankenponSpockMultiplayerOpponentDescription'))
            .setRequired(true))));
  }

  async execute(interaction: CommandInteraction) {
    const { options } = interaction;

    const subcommand = <'game' | 'spock'>options.getSubcommandGroup();

    await this[subcommand]?.(interaction);
  }

  async game(interaction: CommandInteraction) {
    const { locale, member, options, user } = <CommandInteraction<'cached'>>interaction;

    const name = member?.displayName ?? user.username;

    const subcommand = options.getSubcommand();

    const embeds = [new MessageEmbed().setColor('RANDOM').setTitle('Jankenpon')];

    if (subcommand === 'single') {
      const jankenpon = options.getString('jankenpon', true);

      const { player1, player2, result } = JKP.game(jankenpon);

      embeds[0].addFields([
        { name, value: `${this.emoji[player1]} ${player1}`, inline: true },
        { name: 'Result', value: result, inline: true },
        { name: 'Machine', value: `${this.emoji[player2]} ${player2}`, inline: true },
      ]);

      return await interaction.reply({ embeds });
    }

    if (subcommand === 'multiplayer') {
      if (!interaction.inCachedGuild())
        return await interaction.reply({ content: this.t('onlyOnServer', { locale }), ephemeral: true });

      const player2 = options.getMember('opponent', true);

      embeds[0].setDescription(`${user} - ${player2}`)
        .addFields([
          { name: `${name}`, value: '0', inline: true },
          { name: 'Result', value: '-', inline: true },
          { name: `${player2.displayName}`, value: '0', inline: true },
        ]);

      const buttons = [
        new MessageButton().setCustomId(JSON.stringify({ c: 'jkp', p: [user.id, player2.id], v: 1 }))
          .setEmoji('✊').setLabel('Rock').setStyle(this.randomButtonStyle),
        new MessageButton().setCustomId(JSON.stringify({ c: 'jkp', p: [user.id, player2.id], v: 2 }))
          .setEmoji('✋').setLabel('Paper').setStyle(this.randomButtonStyle),
        new MessageButton().setCustomId(JSON.stringify({ c: 'jkp', p: [user.id, player2.id], v: 3 }))
          .setEmoji('✌️').setLabel('Scissors').setStyle(this.randomButtonStyle),
      ];

      const components = [new MessageActionRow().setComponents(buttons)];

      return await interaction.reply({ components, embeds });
    }
  }

  async spock(interaction: CommandInteraction) {
    const { locale, member, options, user } = <CommandInteraction<'cached'>>interaction;

    const name = member?.displayName ?? user.username;

    const subcommand = options.getSubcommand();

    const embeds = [new MessageEmbed().setColor('RANDOM').setTitle('Jankenpon')];

    if (subcommand === 'single') {
      const jankenpon = options.getString('jankenpon', true);

      const { player1, player2, result } = JKP.spock(jankenpon);

      embeds[0].addFields([
        { name, value: `${this.emoji[player1]} ${player1}`, inline: true },
        { name: 'Result', value: result, inline: true },
        { name: 'Machine', value: `${this.emoji[player2]} ${player2}`, inline: true },
      ]);

      return await interaction.reply({ embeds });
    }

    if (subcommand === 'multiplayer') {
      if (!interaction.inCachedGuild())
        return await interaction.reply({ content: this.t('onlyOnServer', { locale }), ephemeral: true });

      const player2 = options.getMember('opponent', true);

      embeds[0].setDescription(`${user} - ${player2}`)
        .addFields([
          { name: `${name}`, value: '0', inline: true },
          { name: 'Result', value: '-', inline: true },
          { name: `${player2.displayName}`, value: '0', inline: true },
        ]);

      const buttons = [
        new MessageButton().setCustomId(JSON.stringify({ c: 'jkp', p: [user.id, player2.id], v: 1 }))
          .setEmoji('✊').setLabel('Rock').setStyle(this.randomButtonStyle),
        new MessageButton().setCustomId(JSON.stringify({ c: 'jkp', p: [user.id, player2.id], v: 2 }))
          .setEmoji('✋').setLabel('Paper').setStyle(this.randomButtonStyle),
        new MessageButton().setCustomId(JSON.stringify({ c: 'jkp', p: [user.id, player2.id], v: 3 }))
          .setEmoji('✌️').setLabel('Scissors').setStyle(this.randomButtonStyle),
        new MessageButton().setCustomId(JSON.stringify({ c: 'jkp', p: [user.id, player2.id], v: 4 }))
          .setEmoji('🦎').setLabel('Lizard').setStyle(this.randomButtonStyle),
        new MessageButton().setCustomId(JSON.stringify({ c: 'jkp', p: [user.id, player2.id], v: 5 }))
          .setEmoji('🖖').setLabel('Spock').setStyle(this.randomButtonStyle),
      ];

      const components = [new MessageActionRow().setComponents(buttons)];

      return await interaction.reply({ components, embeds });
    }
  }
}