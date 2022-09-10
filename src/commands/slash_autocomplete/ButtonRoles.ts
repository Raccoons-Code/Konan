import { APIActionRowComponent, APIButtonComponent, ApplicationCommandOptionChoiceData, AutocompleteInteraction, ButtonStyle, ComponentType, SlashCommandBuilder } from 'discord.js';
import type { ButtonRolesCustomId } from '../../@types';
import { SlashCommand } from '../../structures';

export default class ButtonRoles extends SlashCommand {
  [x: string]: any;
  CommandNameRegExp = /"c":"buttonroles"/;

  constructor() {
    super({
      category: 'Moderation',
      appPermissions: ['EmbedLinks', 'ManageRoles', 'SendMessages'],
      userPermissions: ['ManageRoles'],
    });

    this.data = new SlashCommandBuilder().setName('buttonroles')
      .setDescription('Manage button roles.');
  }

  async execute(interaction: AutocompleteInteraction<'cached'>): Promise<any> {
    if (interaction.responded) return;

    const { memberPermissions, options } = interaction;

    const userPerms = memberPermissions.missing(this.props!.userPermissions!);

    if (userPerms.length)
      return this.replyMissingPermission(interaction, userPerms, 'missingUserPermission');

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
          m.components.some(c => this.CommandNameRegExp.test(c.components[0].customId!)) &&
          pattern.test(m.id)));

      for (let i = 0; i < messages.length; i++) {
        const { embeds, id } = messages[i];

        const { title, description } = embeds[0];

        const name = [
          id,
          title ? ` | ${title}` : '',
          description ? ` | ${description}` : '',
        ].join('').slice(0, 100);

        if (title || description)
          res.push({
            name,
            value: `${id}`,
          });

        if (res.length === 25) break;
      }

      return res;
    }

    const message_id = options.getString('message_id', true).match(this.regexp.messageURL)?.[1];
    if (!message_id) return res;

    if (focused.name === 'button') {
      const message = await channel.messages.safeFetch(message_id);
      if (!message?.editable) return res;

      for (let i = 0; i < message.components.length; i++) {
        const component = <APIActionRowComponent<APIButtonComponent>>message.components[i].toJSON();

        if (component.components[0].type !== ComponentType.Button) continue;

        for (let j = 0; j < component.components.length; j++) {
          const button = component.components[j];

          if (button.style === ButtonStyle.Link) continue;

          const { id, roleId } = <ButtonRolesCustomId>(this.Util.JSONparse(button.custom_id) ?? {});

          const role = await guild.roles.fetch(id ?? roleId);

          const name = [
            `${i + 1} - ${j + 1}`,
            button.emoji?.id ? '' : button.emoji?.name,
            button.label ? ` | ${button.label}` : '',
            ` | ${role?.name}`,
            ` | ${id ?? roleId}`,
            ` | ${button.style}`,
            button.disabled ? ' | disabled' : '',
          ].join('').slice(0, 100);

          if (pattern.test(name))
            res.push({
              name,
              value: button.custom_id,
            });
        }
      }

      return res;
    }

    return res;
  }

  async addAutocomplete(interaction: AutocompleteInteraction<'cached'>) {
    return this.editAutocomplete(interaction);
  }

  async removeAutocomplete(interaction: AutocompleteInteraction<'cached'>) {
    return this.editAutocomplete(interaction);
  }

  async bulkAutocomplete(interaction: AutocompleteInteraction<'cached'>): Promise<any> {
    return this[`bulk_${interaction.options.getSubcommand()}Autocomplete`]?.(interaction);
  }

  async bulk_addAutocomplete(interaction: AutocompleteInteraction<'cached'>) {
    return this.editAutocomplete(interaction);
  }

  async bulk_removeAutocomplete(interaction: AutocompleteInteraction<'cached'>) {
    return this.editAutocomplete(interaction);
  }
}