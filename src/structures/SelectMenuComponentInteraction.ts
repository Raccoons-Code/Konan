import { SelectMenuInteraction } from 'discord.js';
import { ComponentInteractionData } from '../@types';
import Base from './Base';
import Client from './Client';

export default abstract class MenuComponentInteraction extends Base {
  constructor(client: Client, public data: ComponentInteractionData) {
    super(client);
  }

  abstract execute(interaction: SelectMenuInteraction): Promise<any>;
}