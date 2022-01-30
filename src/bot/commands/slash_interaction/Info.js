const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, MessageEmbed } = require('discord.js');
const { Client } = require('../../classes');

module.exports = class extends SlashCommandBuilder {
	/** @param {Client} client */
  constructor(client) {
    super();
    this.client = client;
    this.t = client.t;
    this.data = this.setName('info')
      .setDescription('Info')
      .addSubcommand(subCommand => subCommand.setName('server')
        .setDescription('Server info'))
      .addSubcommand(subCommand => subCommand.setName('user')
        .setDescription('User info')
        .addUserOption(option => option.setName('user')
          .setDescription('Select user.')));
  }

  /** @param {CommandInteraction} interaction */
  async execute(interaction) {
    this.interaction = interaction;

    const embeds = this.embeds = [new MessageEmbed().setColor('RANDOM')];

    this[interaction.options.getSubcommand()]?.(interaction, embeds);
  }

  async server(interaction = this.interaction, embeds = this.embeds) {
    const { guild, locale } = interaction;

    if (!guild)
      return interaction.reply({
        content: this.t('Error! This command can only be used on one server.', { locale }),
        ephemeral: true,
      });

    embeds[0].setAuthor({ name: `${guild.name}` })
      .setThumbnail(`${guild.iconURL()}`)
      .setFields(
        { name: this.t('ID', { locale }), value: `${guild.id}`, inline: true },
        { name: this.t('Owner', { locale }), value: `<@${guild.ownerId}>`, inline: true },
        { name: this.t('Members', { locale }), value: `${guild.memberCount}`, inline: true },
      )
      .setImage(guild.splashURL({ dynamic: true, format: 'png', size: 512 }))
      .setTimestamp(guild.createdTimestamp)
      .setFooter(this.t('Server created at', { locale }));

    interaction.reply({ embeds, ephemeral: true });
  }

  async user(interaction = this.interaction, embeds = this.embeds) {
    const { guild, locale, options } = interaction;

    const user = options.getUser('user') || interaction.user;

    const { joinedTimestamp, roles } = guild.members.resolve(user.id);

    embeds[0].setDescription(`${user}`)
      .setThumbnail(user.avatarURL())
      .setFields(
        { name: this.t('Discord Tag', { locale }), value: `\`${user.tag}\``, inline: true },
        { name: this.t('Discord ID', { locale }), value: `\`${user.id}\``, inline: true },
        { name: this.t('Role', { locale }), value: `${roles.highest}`, inline: true },
        { name: this.t('Creation date', { locale }), value: `\`${user.createdAt}\``, inline: true },
      )
      .setTimestamp(joinedTimestamp)
      .setFooter(this.t('Joined the server at', { locale }));

    interaction.reply({ embeds, ephemeral: true });
  }
};