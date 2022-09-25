import { ModalSubmitInteraction } from 'discord.js';
import type { ApplicationInteractionData } from '../@types';
import BaseApplicationCommand from './BaseApplicationCommand';

export default abstract class ModalSubmit extends BaseApplicationCommand {
  constructor(public data: ApplicationInteractionData) {
    super();
  }

  abstract execute(interaction: ModalSubmitInteraction): Promise<any>;
}