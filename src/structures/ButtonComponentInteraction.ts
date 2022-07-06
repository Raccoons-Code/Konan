import { ButtonInteraction } from 'discord.js';
import { ComponentInteractionData } from '../@types';
import BaseCommand from './BaseCommand';

export default abstract class ButtonComponentInteraction extends BaseCommand {
  constructor(public data: ComponentInteractionData) {
    super();
  }

  abstract execute(interaction: ButtonInteraction): Promise<any>;
}