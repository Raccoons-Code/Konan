import { SelectMenuInteraction } from 'discord.js';
import type { ApplicationInteractionData } from '../@types';
import BaseApplicationCommand from './BaseApplicationCommand';

export default abstract class MenuComponentInteraction extends BaseApplicationCommand {
  constructor(public data: ApplicationInteractionData) {
    super();
  }

  abstract execute(interaction: SelectMenuInteraction): Promise<any>;
}