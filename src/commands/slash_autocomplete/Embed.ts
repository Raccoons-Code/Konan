import { ApplicationCommandOptionChoiceData, AutocompleteInteraction, SlashCommandBuilder } from 'discord.js';
import { SlashCommand } from '../../structures';

export default class Embed extends SlashCommand {
  [x: string]: any;

  constructor() {
    super({
      category: 'Utility',
      appPermissions: ['SendMessages', 'AttachFiles'],
      userPermissions: ['ManageMessages'],
    });

    this.data = new SlashCommandBuilder().setName('embed')
      .setDescription('Send a embed message.');
  }

  async execute(interaction: AutocompleteInteraction<'cached'>) {
    if (interaction.responded) return;

    const { channel, client, memberPermissions, options } = interaction;

    const userPerms = memberPermissions.missing(this.props!.userPermissions!);

    if (userPerms.length)
      return this.replyMissingPermission(interaction, userPerms, 'missingUserPermission');

    const appPerms = channel?.permissionsFor(client.user!)?.missing(this.props!.appPermissions!);

    if (appPerms?.length)
      return this.replyMissingPermission(interaction, appPerms, 'missingChannelPermission');

    const subcommand = options.getSubcommandGroup() ?? options.getSubcommand();

    const response = await this[`${subcommand}Autocomplete`]?.(interaction);

    return interaction.respond(response);
  }

  async editAutocomplete(
    interaction: AutocompleteInteraction<'cached'>,
    res: ApplicationCommandOptionChoiceData[] = [],
  ) {
    const { client, guild, options } = interaction;

    const channelId = options.get('channel')?.value;
    if (!channelId) return res;

    const channel = await guild.channels.fetch(`${channelId}`);
    if (!channel?.isTextBased()) return res;

    const focused = options.getFocused(true);
    const pattern = RegExp(`${focused.value}`, 'i');

    if (focused.name === 'message_id') {
      const messages = await channel.messages.fetch({ limit: 100 })
        .then(ms => ms.toJSON().filter(m =>
          m.author.id === client.user?.id &&
          m.embeds.length &&
          pattern.test(`${m.id}`)));

      for (let i = 0; i < messages.length; i++) {
        const { embeds, id } = messages[i];

        const { title, description } = embeds[0];

        const name = [
          id,
          title ? ` | ${title}` : '',
          description ? ` | ${description}` : '',
        ].join('').slice(0, 100);

        res.push({
          name,
          value: `${id}`,
        });

        if (res.length === 25) break;
      }

      return res;
    }

    return res;
  }
}