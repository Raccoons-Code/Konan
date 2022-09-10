import { ApplicationCommandOptionChoiceData, AutocompleteInteraction, SlashCommandBuilder } from 'discord.js';
import { watchTogether } from '../../modules/WatchTogether';
import { SlashCommand } from '../../structures';

export default class WatchTogether extends SlashCommand {
  constructor() {
    super({
      category: 'Utility',
      appPermissions: ['CreateInstantInvite'],
    });

    this.data = new SlashCommandBuilder().setName('party')
      .setDescription('Create an activity party together - Powered by Discord Together.');
  }

  async execute(interaction: AutocompleteInteraction<'cached'>) {
    return this.executeAutocomplete(interaction);
  }

  async executeAutocomplete(interaction: AutocompleteInteraction) {
    if (interaction.responded) return;

    const { locale, options } = interaction;

    const activity = options.getString('activity', true);
    const pattern = RegExp(activity, 'i');

    const applications = watchTogether.applications.filter(app =>
      pattern.test(`${app}`) ||
      pattern.test(this.t(`${app}`, { locale })));

    const response = this.setChoices(applications, { locale });

    return interaction.respond(response);
  }

  setChoices(applications: any[], options: { locale: string }, res: ApplicationCommandOptionChoiceData[] = []) {
    const { locale } = options;

    applications = applications.filter(app => !/(awkword|doodlecrew|lettertile|puttparty|dev$)/i.test(app));

    for (let i = 0; i < applications.length; i++) {
      const application = applications[i];

      res.push({
        name: `${this.t(application, { locale })}`,
        value: `${application}`,
      });

      if (res.length === 25) break;
    }

    return res;
  }
}