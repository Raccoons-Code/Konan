import { SlashCommandBuilder } from '@discordjs/builders';
import { ApplicationCommandOptionChoiceData, AutocompleteInteraction, CommandInteraction } from 'discord.js';
import { Client, SlashCommand } from '../../structures';

export default class Unban extends SlashCommand {
  constructor(client: Client) {
    super(client, {
      category: 'Moderation',
      clientPermissions: ['BAN_MEMBERS'],
      userPermissions: ['BAN_MEMBERS'],
    });

    this.data = new SlashCommandBuilder().setName('unban')
      .setDescription('Revoke a user\'s ban.')
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
      if (interaction.isAutocomplete()) return await interaction.respond([]);

      return await interaction.reply({ content: this.t('onlyOnServer', { locale }), ephemeral: true });
    }

    const { guild, memberPermissions, options } = interaction;

    const userPermissions = memberPermissions.missing(this.props!.userPermissions!) ?? [];

    if (userPermissions.length) {
      if (interaction.isAutocomplete()) return await interaction.respond([]);

      return await interaction.reply({
        content: this.t('missingUserPermission', { locale, PERMISSIONS: userPermissions }),
        ephemeral: true,
      });
    }

    const clientPermissions = guild.me?.permissions.missing(this.props!.clientPermissions!) ?? [];

    if (clientPermissions.length) {
      if (interaction.isAutocomplete()) return await interaction.respond([]);

      return await interaction.reply({
        content: this.t('missingPermission', { locale, PERMISSIONS: clientPermissions }),
        ephemeral: true,
      });
    }

    if (interaction.isAutocomplete())
      return await this.executeAutocomplete(interaction);

    await interaction.deferReply({ ephemeral: true });

    const id = options.getString('user', true).split(' |')[0];

    const ban = await guild.bans.fetch(id);

    if (!ban)
      return await interaction.editReply(this.t('ban404', { locale }));

    const reason = options.getString('reason') ?? undefined;

    try {
      await guild.bans.remove(id, reason);

      await interaction.editReply(this.t('userUnbanned', { locale }));
    } catch {
      await interaction.editReply(this.t('unbanError', { locale }));
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

      const nameProps = [
        ban.user.id,
        ' | ', ban.user.tag,
        ban.reason ? ` | Reason: ${ban.reason}` : '',
      ];

      res.push({
        name: `${nameProps.join('').slice(0, 100)}`,
        value: `${ban.user.id}`,
      });

      if (i === 24) break;
    }

    await interaction.respond(res);
  }
}