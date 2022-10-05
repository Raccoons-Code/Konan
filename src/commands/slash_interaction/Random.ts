import { APIApplicationCommandOptionChoice, ChatInputCommandInteraction } from 'discord.js';
import { request } from 'undici';
import { SlashCommand } from '../../structures';
import Util from '../../util';

const Choices = new class {
  choices: string[];
  #choices!: APIApplicationCommandOptionChoice<string>[];

  constructor() {
    this.choices = ['Cat'];

    this.setChoices();
  }

  getChoices() {
    return this.#choices ?? this.setChoices();
  }

  getRandom() {
    return this.choices.sort(() => Math.random() - 0.5)[Util.mathRandom(this.choices.length, 0)];
  }

  setChoices(array: APIApplicationCommandOptionChoice<string>[] = []) {
    for (let i = 0; i < this.choices.length; i++) {
      const choice = this.choices[i];

      array[i] = {
        name: Util.capitalize(choice),
        value: choice,
        name_localizations: Util.getLocalizations(choice),
      };
    }

    return this.#choices = array;
  }
};

export default class Random extends SlashCommand {
  [x: string]: any;

  constructor() {
    super({
      category: 'Fun',
      appPermissions: ['AttachFiles'],
    });

    this.data.setName('random')
      .setDescription('Replies with random images.');
  }

  build() {
    return this.data
      .setNameLocalizations(this.getLocalizations('randomName'))
      .setDescriptionLocalizations(this.getLocalizations('randomDescription'))
      .addStringOption(option => option.setName('type')
        .setDescription('Select the type of the random image.')
        .setNameLocalizations(this.getLocalizations('randomTypeName'))
        .setDescriptionLocalizations(this.getLocalizations('randomTypeDescription'))
        .setChoices(...Choices.getChoices()));
  }

  async execute(interaction: ChatInputCommandInteraction) {
    const { channel, client, options } = <ChatInputCommandInteraction<'cached'>>interaction;

    const appPerms = channel?.permissionsFor(client.user!)?.missing(this.props!.appPermissions!);

    if (appPerms?.length)
      return this.replyMissingPermission(interaction, appPerms, 'missingChannelPermission');

    await interaction.deferReply();

    const string = options.getString('type');

    return this[`execute${string ?? Choices.getRandom()}`]?.(interaction);
  }

  async executeCat(interaction: ChatInputCommandInteraction): Promise<any> {
    const { file } = await request('https://aws.random.cat/meow').then(r => r.body.json());

    return interaction.editReply({ files: [file] });
  }
}