import { ButtonInteraction } from 'discord.js';
import { ComponentInteractionData } from '../@types';
import Base from './Base';
import Client from './Client';

export default class ButtonComponentInteraction extends Base {
  constructor(client: Client, public data: ComponentInteractionData) {
    super(client);
  }

  public async execute(interaction: ButtonInteraction) { }
}