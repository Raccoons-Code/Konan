import { ApplicationCommandOptionChoiceData, AutocompleteInteraction } from 'discord.js';
import { SlashAutocomplete } from '../../structures';

export default class Unban extends SlashAutocomplete {
  constructor() {
    super({
      name: 'unban',
      description: 'Revoke a user\'s ban.',
      appPermissions: ['BanMembers'],
      userPermissions: ['BanMembers'],
    });
  }

  async execute(interaction: AutocompleteInteraction<'cached'>, res: ApplicationCommandOptionChoiceData[] = []) {
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