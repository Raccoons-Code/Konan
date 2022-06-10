import { ModalSubmitInteraction } from 'discord.js';
import { ComponentInteractionData } from '../@types';
import Base from './Base';
import Client from './Client';

export default abstract class ModalSubmit extends Base {
  constructor(client: Client, public data: ComponentInteractionData) {
    super(client);
  }

  abstract execute(interaction: ModalSubmitInteraction): Promise<any>;
}