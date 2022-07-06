import { SelectMenuInteraction } from 'discord.js';
import { ComponentInteractionData } from '../@types';
import BaseCommand from './BaseCommand';

export default abstract class MenuComponentInteraction extends BaseCommand {
  constructor(public data: ComponentInteractionData) {
    super();
  }

  abstract execute(interaction: SelectMenuInteraction): Promise<any>;
}