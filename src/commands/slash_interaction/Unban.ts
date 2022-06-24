import { SlashCommandBuilder } from '@discordjs/builders';
import { ApplicationCommandOptionChoiceData, AutocompleteInteraction, Client, CommandInteraction, Permissions } from 'discord.js';
import { SlashCommand } from '../../structures';

export default class Unban extends SlashCommand {
  constructor(client: Client) {
    super(client, {
      category: 'Moderation',
      clientPermissions: ['BAN_MEMBERS'],
      userPermissions: ['BAN_MEMBERS'],
    });

    this.data = new SlashCommandBuilder().setName('unban')
      .setDescription('Revoke a user\'s ban.')
      .setDMPermission(false)
      .setDefaultMemberPermissions(Permissions.FLAGS.BAN_MEMBERS)
      .setNameLocalizations(this.getLocalizations('unbanName'))
      .setDescriptionLocalizations(this.getLocalizations('unbanDescription'))
      .addStringOption(option => option.setName('user')
        .setDescription('User ID')
        .setNameLocalizations(this.getLocalizations('unbanUserName'))
        .setDescriptionLocalizations(this.getLocalizations('unbanUserDescription'))
        .setAutocomplete(true)
        .setRequired(true))
      .addStringOption(option => option.setName('reason')
        .setDescription('The reason to unban.')
        .setNameLocalizations(this.getLocalizations('unbanReasonName'))
        .setDescriptionLocalizations(this.getLocalizations('unbanReasonDescription')));
  }

  async execute(interaction: CommandInteraction | AutocompleteInteraction) {
    const { locale } = interaction;

    if (!interaction.inCachedGuild()) {
      if (interaction.isAutocomplete()) return interaction.respond([]);

      return interaction.reply({ content: this.t('onlyOnServer', { locale }), ephemeral: true });
    }

    const { guild, member, memberPermissions, options } = interaction;

    const userPerms = memberPermissions.missing(this.props!.userPermissions!);

    if (userPerms.length) {
      if (interaction.isAutocomplete()) return interaction.respond([]);

      return interaction.reply({
        content: this.t('missingUserPermission', {
          locale,
          permission: this.t(userPerms[0], { locale }),
        }),
        ephemeral: true,
      });
    }

    const clientPerms = guild.me?.permissions.missing(this.props!.clientPermissions!);

    if (clientPerms?.length) {
      if (interaction.isAutocomplete()) return interaction.respond([]);

      return interaction.reply({
        content: this.t('missingPermission', {
          locale,
          permission: this.t(clientPerms[0], { locale }),
        }),
        ephemeral: true,
      });
    }

    if (interaction.isAutocomplete())
      return this.executeAutocomplete(interaction);

    await interaction.deferReply({ ephemeral: true });

    const id = options.getString('user', true).split(' |')[0];

    const ban = await guild.bans.fetch(id);

    if (!ban)
      return interaction.editReply(this.t('ban404', { locale }));

    const reason = `${member.displayName}: ${options.getString('reason') || '-'}`;

    try {
      await guild.bans.remove(id, reason);

      return interaction.editReply(this.t('userUnbanned', { locale }));
    } catch {
      return interaction.editReply(this.t('unbanError', { locale }));
    }
  }

  async executeAutocomplete(interaction: AutocompleteInteraction, res: ApplicationCommandOptionChoiceData[] = []) {
    if (interaction.responded) return;

    const { guild, options } = <AutocompleteInteraction<'cached'>>interaction;

    const user = options.getString('user', true);
    const pattern = RegExp(user, 'i');

    const bans_collection = await guild.bans.fetch();

    const bans_array = bans_collection.filter(ban =>
      pattern.test(ban.user.tag) ||
      pattern.test(ban.user.id) ||
      pattern.test(<string>ban.reason)).toJSON();

    for (let i = 0; i < bans_array.length; i++) {
      const ban = bans_array[i];

      const name = [
        ban.user.id,
        ' | ', ban.user.tag,
        ban.reason ? ` | Reason: ${ban.reason}` : '',
      ].join('').slice(0, 100);

      res.push({
        name,
        value: `${ban.user.id}`,
      });

      if (res.length === 25) break;
    }

    return interaction.respond(res);
  }
}