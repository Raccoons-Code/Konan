import { ApplicationCommandOptionChoiceData, AutocompleteInteraction } from 'discord.js';
import { SlashAutocomplete } from '../../structures';

export default class Admin extends SlashAutocomplete {
  [x: string]: any;

  constructor() {
    super({
      name: 'admin',
      description: 'Admin commands (Restricted for bot\'owners).',
    });
  }

  async execute(interaction: AutocompleteInteraction) {
    if (interaction.responded) return;

    const { client, options, user } = interaction;

    if (!await this.Util.getAppOwners.isOwner(client, user.id)) return;

    const subcommand = options.getSubcommandGroup() ?? options.getSubcommand();

    const response = await this[`${subcommand}Autocomplete`](interaction);

    return interaction.respond(response);
  }

  async guildsAutocomplete(interaction: AutocompleteInteraction, res: ApplicationCommandOptionChoiceData[] = []) {
    const { client, locale, options } = interaction;

    const focused = options.getFocused(true);

    if (focused.name === 'query') {
      const query = options.getString('query', true);
      const pattern = new RegExp(query, 'i');

      const guildsArray = client.guilds.cache.filter(guild =>
        pattern.test(guild.nameAcronym) ||
        pattern.test(guild.name) ||
        pattern.test(guild.id)).toJSON().slice(0, 25);

      for (let i = 0; i < guildsArray.length; i++) {
        const guild = guildsArray[i];

        const name = [
          guild.nameAcronym,
          guild.name,
          guild.memberCount,
          guild.createdAt.toLocaleDateString(locale),
          guild.id,
        ];

        res.push({
          name: name.join(' - ').slice(0, 100),
          value: guild.id,
        });
      }

      return res;
    }
  }

  async usersAutocomplete(interaction: AutocompleteInteraction, res: ApplicationCommandOptionChoiceData[] = []) {
    const { client, locale, options } = interaction;

    const focused = options.getFocused(true);

    if (focused.name === 'query') {
      const query = options.getString('query', true);
      const pattern = new RegExp(query, 'i');

      const usersArray = client.users.cache.filter(user =>
        pattern.test(user.tag) ||
        pattern.test(user.id)).toJSON().slice(0, 25);

      for (let i = 0; i < usersArray.length; i++) {
        const user = usersArray[i];

        const name = [
          user.tag,
          user.createdAt.toLocaleDateString(locale),
          user.id,
        ];

        res.push({
          name: name.join(' - ').slice(0, 100),
          value: user.id,
        });
      }

      return res;
    }
  }
}