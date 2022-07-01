import { ApplicationCommandOptionChoiceData, AutocompleteInteraction, ChatInputCommandInteraction, Client, InteractionType, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { SlashCommand } from '../../structures';

const { ApplicationCommandAutocomplete } = InteractionType;

export default class Unban extends SlashCommand {
  constructor(client: Client) {
    super(client, {
      category: 'Moderation',
      clientPermissions: ['BanMembers'],
      userPermissions: ['BanMembers'],
    });

    this.data = new SlashCommandBuilder().setName('unban')
      .setDescription('Revoke a user\'s ban.')
      .setDMPermission(false)
      .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
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

  async execute(interaction: ChatInputCommandInteraction | AutocompleteInteraction) {
    const { locale } = interaction;

    if (!interaction.inCachedGuild()) {
      if (interaction.type === ApplicationCommandAutocomplete) return interaction.respond([]);

      return interaction.reply({ content: this.t('onlyOnServer', { locale }), ephemeral: true });
    }

    const { guild, member, memberPermissions, options } = interaction;

    const userPerms = memberPermissions.missing(this.props!.userPermissions!);

    if (userPerms.length) {
      if (interaction.type === ApplicationCommandAutocomplete) return interaction.respond([]);

      return interaction.reply({
        content: this.t('missingUserPermission', {
          locale,
          permission: this.t(userPerms[0], { locale }),
        }),
        ephemeral: true,
      });
    }

    const clientPerms = guild.members.me?.permissions.missing(this.props!.clientPermissions!);

    if (clientPerms?.length) {
      if (interaction.type === ApplicationCommandAutocomplete) return interaction.respond([]);

      return interaction.reply({
        content: this.t('missingPermission', {
          locale,
          permission: this.t(clientPerms[0], { locale }),
        }),
        ephemeral: true,
      });
    }

    if (interaction.type === ApplicationCommandAutocomplete)
      return this.executeAutocomplete(interaction);

    await interaction.deferReply({ ephemeral: true });

    const id = options.getString('user', true);

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

  async executeAutocomplete(
    interaction: AutocompleteInteraction<'cached'>,
    res: ApplicationCommandOptionChoiceData[] = [],
  ) {
    if (interaction.responded) return;

    const { guild, options } = interaction;

    const user = options.getString('user', true);
    const pattern = RegExp(user, 'i');

    const bansCollection = await guild.bans.fetch();

    const bansArray = bansCollection.filter(ban =>
      pattern.test(ban.user.tag) ||
      pattern.test(ban.user.id) ||
      pattern.test(ban.reason!)).toJSON();

    for (let i = 0; i < bansArray.length; i++) {
      const ban = bansArray[i];

      const name = [
        ban.user.tag, ' | ', ban.user.id,
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