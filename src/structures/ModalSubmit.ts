import { ModalSubmitInteraction } from 'discord.js';
import { ComponentInteractionData } from '../@types';
import BaseCommand from './BaseCommand';

export default abstract class ModalSubmit extends BaseCommand {
  constructor(public data: ComponentInteractionData) {
    super();
  }

  abstract execute(interaction: ModalSubmitInteraction): Promise<any>;
}