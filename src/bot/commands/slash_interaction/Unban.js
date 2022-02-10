const { SlashCommand } = require('../../classes');

module.exports = class extends SlashCommand {
  constructor(...args) {
    super(...args, {
      clientPermissions: ['BAN_MEMBERS'],
      userPermissions: ['BAN_MEMBERS'],
    });
    this.data = this.setName('unban')
      .setDescription('Revokes the ban from the selected user.')
      .addStringOption(option => option.setName('user')
        .setDescription('User id')
        .setAutocomplete(true)
        .setRequired(true))
      .addStringOption(option => option.setName('reason')
        .setDescription('Reason'));
  }

  async execute(interaction = this.CommandInteraction) {
    const { guild, locale, memberPermissions, options } = interaction;

    if (!interaction.inGuild()) {
      if (interaction.isAutocomplete()) return interaction.respond([]);

      return interaction.editReply(this.t('Error! This command can only be used on one server.', { locale }));
    }

    if (interaction.isAutocomplete())
      return this.executeAutocomplete(interaction);

    await interaction.deferReply({ ephemeral: true });

    const userPermissions = memberPermissions.missing(this.props.userPermissions);

    if (userPermissions.length)
      return interaction.editReply(this.t('missingUserPermission', { locale, PERMISSIONS: userPermissions }));

    const clientPermissions = guild.me.permissions.missing(this.props.clientPermissions);

    if (clientPermissions.length)
      return interaction.editReply(this.t('missingPermission', { locale, PERMISSIONS: clientPermissions }));

    const id = options.getString('user');

    const ban = guild.bans.resolve(id) || await guild.bans.fetch(id);

    if (!ban)
      return interaction.editReply(this.t('This user is not banned!', { locale }));

    const reason = options.getString('reason');

    guild.members.unban(id, reason)
      .then(() => interaction.editReply(this.t('User successfully unbanned!', { locale })))
      .catch(() => interaction.editReply(this.t('Error! Unable to unban this user.', { locale })));
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
        name: `${ban.user.username}${ban.reason ? ` | Reason: ${ban.reason}` : ''}`,
        value: ban.user.id,
      });

      if (i === 24) break;
    }

    interaction.respond(res);
  }
};