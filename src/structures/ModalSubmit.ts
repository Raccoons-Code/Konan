import { ModalSubmitInteraction } from 'discord.js';
import { ComponentInteractionData } from '../@types';
import BaseApplicationCommand from './BaseApplicationCommand';

export default abstract class ModalSubmit extends BaseApplicationCommand {
  constructor(public data: ComponentInteractionData) {
    super();
  }

  abstract execute(interaction: ModalSubmitInteraction): Promise<any>;
}