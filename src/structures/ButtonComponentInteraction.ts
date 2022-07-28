import { ButtonInteraction } from 'discord.js';
import { ComponentInteractionData } from '../@types';
import BaseApplicationCommand from './BaseApplicationCommand';

export default abstract class ButtonComponentInteraction extends BaseApplicationCommand {
  constructor(public data: ComponentInteractionData) {
    super();
  }

  abstract execute(interaction: ButtonInteraction): Promise<any>;
}