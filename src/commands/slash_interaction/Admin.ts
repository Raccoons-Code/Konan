import { ApplicationCommandOptionChoiceData, AutocompleteInteraction, ChatInputCommandInteraction, InteractionType, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { SlashCommand } from '../../structures';

export default class Admin extends SlashCommand {
  [x: string]: any;

  constructor() {
    super({
      ownerOnly: true,
    });

    this.data = new SlashCommandBuilder().setName('admin')
      .setDescription('Admin commands (Restricted for bot\'owners).')
      .setDMPermission(false)
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
      .addSubcommandGroup(subcommandgroup => subcommandgroup.setName('guilds')
        .setDescription('Guild management commands.')
        .addSubcommand(subcommand => subcommand.setName('search')
          .setDescription('Search for a guild by their ID.')
          .addStringOption(option => option.setName('query')
            .setDescription('Search for a guild by their name.')
            .setAutocomplete(true)
            .setRequired(true))))
      .addSubcommandGroup(subcommandgroup => subcommandgroup.setName('users')
        .setDescription('User management commands.')
        .addSubcommand(subcommand => subcommand.setName('search')
          .setDescription('Search for a user by their ID.')
          .addStringOption(option => option.setName('query')
            .setDescription('Search for a user by their username.')
            .setAutocomplete(true)
            .setRequired(true))));
  }

  async execute(interaction: ChatInputCommandInteraction | AutocompleteInteraction) {
    const { client, user } = interaction;

    if (!await this.Util.getAppOwners.isOwner(client, user.id)) return;

    if (interaction.type === InteractionType.ApplicationCommandAutocomplete)
      return this.executeAutocomplete(interaction);
  }

  async executeAutocomplete(interaction: AutocompleteInteraction) {
    const { options } = interaction;

    const subcommand = options.getSubcommandGroup() ?? options.getSubcommand();

    const res = await this[`${subcommand}Autocomplete`](interaction);

    return interaction.respond(res);
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