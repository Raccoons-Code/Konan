import { APIActionRowComponent, APISelectMenuComponent, ApplicationCommandOptionChoiceData, AutocompleteInteraction, ComponentType, SlashCommandBuilder } from 'discord.js';
import { SlashCommand } from '../../structures';

export default class SelectRoles extends SlashCommand {
  [x: string]: any;
  CommandNameRegExp = /"c":"selectroles"/;

  constructor() {
    super({
      category: 'Moderation',
      appPermissions: ['EmbedLinks', 'ManageRoles', 'SendMessages'],
      userPermissions: ['ManageRoles'],
    });

    this.data = new SlashCommandBuilder().setName('selectroles')
      .setDescription('Manage roles with a select menu.');
  }

  async execute(interaction: AutocompleteInteraction<'cached'>) {
    const userPerms = interaction.memberPermissions.missing(this.props!.userPermissions!);

    if (userPerms.length)
      return this.replyMissingPermission(interaction, userPerms, 'missingUserPermission');

    return this.executeAutocomplete(interaction);
  }

  async executeAutocomplete(interaction: AutocompleteInteraction<'cached'>) {
    if (interaction.responded) return;

    const { options } = interaction;

    const subcommand = options.getSubcommandGroup() ?? options.getSubcommand();

    const response = await this[`${subcommand}Autocomplete`]?.(interaction);

    return interaction.respond(response);
  }

  async bulkAutocomplete(interaction: AutocompleteInteraction<'cached'>): Promise<any> {
    const { options } = interaction;

    const subcommand = options.getSubcommand();

    return this[`bulk_${subcommand}Autocomplete`]?.(interaction);
  }

  async bulk_addAutocomplete(interaction: AutocompleteInteraction<'cached'>) {
    return this.editAutocomplete(interaction);
  }

  async bulk_removeAutocomplete(interaction: AutocompleteInteraction<'cached'>) {
    return this.editAutocomplete(interaction);
  }

  async addAutocomplete(interaction: AutocompleteInteraction<'cached'>) {
    return this.editAutocomplete(interaction);
  }

  async removeAutocomplete(interaction: AutocompleteInteraction<'cached'>) {
    return this.editAutocomplete(interaction);
  }

  async editAutocomplete(
    interaction: AutocompleteInteraction<'cached'>,
    res: ApplicationCommandOptionChoiceData[] = [],
  ) {
    const { client, guild, options } = interaction;

    const channelId = <string>options.get('channel')?.value;
    if (!channelId) return res;

    const channel = await guild.channels.fetch(channelId);
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

    const message_id = options.getString('message_id')?.match(this.regexp.messageURL)?.[1];
    if (!message_id) return res;

    const message = await channel.messages.safeFetch(message_id);
    if (!message?.editable) return res;

    if (focused.name === 'menu') {
      for (let i = 0; i < message.components.length; i++) {
        const componentJson = <APIActionRowComponent<APISelectMenuComponent>>message.components[i].toJSON();

        if (componentJson.components[0].type !== ComponentType.SelectMenu) continue;

        for (let j = 0; j < componentJson.components.length; j++) {
          const element = componentJson.components[j];

          const name = [
            `${i + 1} - ${j + 1}`,
            element.placeholder ? ` | ${element.placeholder}` : '',
            ` | ${element.options.length} ${element.options.length > 1 ? 'options' : 'option'}`,
            element.disabled ? ' | disabled' : '',
          ].join('').slice(0, 100);

          if (pattern.test(name))
            res.push({
              name,
              value: `${element.custom_id}`,
            });
        }
      }

      return res;
    }

    if (focused.name === 'option') {
      const menuId = options.getString('menu');

      if (!menuId) return res;

      for (let i = 0; i < message.components.length; i++) {
        const componentJson = <APIActionRowComponent<APISelectMenuComponent>>message.components[i].toJSON();

        if (componentJson.components[0].type !== ComponentType.SelectMenu) continue;

        for (let j = 0; j < componentJson.components.length; j++) {
          const element = componentJson.components[j];

          if (element.custom_id !== menuId) continue;

          for (let k = 0; k < element.options.length; k++) {
            const option = element.options[k];

            const value = this.Util.JSONparse(option.value);
            if (!value) continue;

            const role = await guild.roles.fetch(value.id ?? value.roleId);

            const name = [
              option.emoji?.id ? '' : option.emoji?.name,
              option.label ? option.label : ` Option ${j + 1}`,
              ` | ${role?.name}`,
              ` | ${value.id ?? value.roleId}`,
              option.description ? ` | ${option.description}` : '',
            ].join('').slice(0, 100);

            res.push({
              name,
              value: `${option.value}`,
            });
          }
        }
      }

      return res;
    }

    return res;
  }
}