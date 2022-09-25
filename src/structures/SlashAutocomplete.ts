import { AutocompleteInteraction } from 'discord.js';
import type { ApplicationInteractionData } from '../@types';
import BaseApplicationCommand from './BaseApplicationCommand';

export default abstract class SlashAutocomplete extends BaseApplicationCommand {
  constructor(public data: ApplicationInteractionData) {
    super();
  }

  abstract execute(interaction: AutocompleteInteraction): Promise<any>;
}