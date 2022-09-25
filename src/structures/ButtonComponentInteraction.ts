import { ButtonInteraction } from 'discord.js';
import type { ApplicationInteractionData } from '../@types';
import BaseApplicationCommand from './BaseApplicationCommand';

export default abstract class ButtonComponentInteraction extends BaseApplicationCommand {
  constructor(public data: ApplicationInteractionData) {
    super();
  }

  abstract execute(interaction: ButtonInteraction): Promise<any>;
}