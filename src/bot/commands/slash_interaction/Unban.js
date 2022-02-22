const { SlashCommand } = require('../../classes');

module.exports = class extends SlashCommand {
  constructor(client) {
    super(client, {
      clientPermissions: ['BAN_MEMBERS'],
      userPermissions: ['BAN_MEMBERS'],
    });
    this.data = this.setName('unban')
      .setDescription('Revokes the ban from the selected user.')
      .addStringOption(option => option.setName('user')
        .setDescription('User ID')
        .setAutocomplete(true)
        .setRequired(true))
      .addStringOption(option => option.setName('reason')
        .setDescription('Reason'));
  }

  async execute(interaction = this.CommandInteraction) {
    const { guild, locale, memberPermissions, options } = interaction;

    if (!interaction.inGuild()) {
      if (interaction.isAutocomplete()) return await interaction.respond([]);

      return await interaction.editReply(this.t('onlyOnServer', { locale }));
    }

    const userPermissions = memberPermissions.missing(this.props.userPermissions);

    if (userPermissions.length)
      return await interaction.reply({
        content: this.t('missingUserPermission', { locale, PERMISSIONS: userPermissions }),
        ephemeral: true,
      });

    const clientPermissions = guild.me.permissions.missing(this.props.clientPermissions);

    if (clientPermissions.length)
      return await interaction.reply({
        content: this.t('missingPermission', { locale, PERMISSIONS: clientPermissions }),
        ephemeral: true,
      });

    if (interaction.isAutocomplete())
      return this.executeAutocomplete(interaction);

    await interaction.deferReply({ ephemeral: true });

    const id = options.getString('user').split(' |')[0];

    const ban = await guild.bans.fetch(id);

    if (!ban)
      return await interaction.editReply(this.t('ban404', { locale }));

    const reason = options.getString('reason');

    try {
      await guild.members.unban(id, reason);

      interaction.editReply(this.t('userBanned', { locale }));
    } catch {
      interaction.editReply(this.t('banError', { locale }));
    }
  }

  async executeAutocomplete(interaction = this.AutocompleteInteraction) {
    if (interaction.responded) return;

    const { guild, options } = interaction;

    const res = [];

    const pattern = options.getString('user');

    const regex = RegExp(pattern, 'i');

    const bans_collection = guild.bans.cache.size ? guild.bans.cache : await guild.bans.fetch();

    const bans_filtered = pattern ? bans_collection.filter(ban => regex.test(ban.user.tag) ||
      regex.test(ban.user.id) || regex.test(ban.reason)) : bans_collection;

    const bans_array = bans_filtered.toJSON();

    for (let i = 0; i < bans_array.length; i++) {
      const ban = bans_array[i];

      res.push({
        name: `${ban.user.id} | ${ban.user.username}${ban.reason ? ` | Reason: ${ban.reason}` : ''}`,
        value: ban.user.id,
      });

      if (i === 24) break;
    }

  await interaction.respond(res);
  }
};