import { SelectMenuInteraction } from 'discord.js';
import type { ComponentInteractionData } from '../@types';
import BaseApplicationCommand from './BaseApplicationCommand';

export default abstract class MenuComponentInteraction extends BaseApplicationCommand {
  constructor(public data: ComponentInteractionData) {
    super();
  }

  abstract execute(interaction: SelectMenuInteraction): Promise<any>;
}