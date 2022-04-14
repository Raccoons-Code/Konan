import { SelectMenuInteraction } from 'discord.js';
import { ComponentInteractionData } from '../@types';
import Base from './Base';
import Client from './Client';

export default class MenuComponentInteraction extends Base {
  constructor(client: Client, public data: ComponentInteractionData) {
    super(client);
  }

  public async execute(interaction: SelectMenuInteraction) { }
}