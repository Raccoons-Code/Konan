import { ActionRowBuilder, APIEmbedField, ButtonBuilder, ButtonInteraction, ButtonStyle, ComponentType, EmbedBuilder } from 'discord.js';
import commandHandler from '..';
import { HelpButtonCustomId } from '../../@types';
import { ButtonComponentInteraction, SlashCommand } from '../../structures';
import Util from '../../util';

export default class Help extends ButtonComponentInteraction {
  [x: string]: any;
  limit = Util.Constants.helpPageLimit;

  constructor() {
    super({
      name: 'help',
      description: 'Help Button',
    });
  }

  async execute(interaction: ButtonInteraction<'cached'>) {
    const { customId } = interaction;

    const { sc } = JSON.parse(customId);

    this[sc]?.(interaction);
  }

  async commands(interaction: ButtonInteraction<'cached'>) {
    const { customId, locale, message } = interaction;

    const { cbc, p } = <HelpButtonCustomId>JSON.parse(customId);

    const commands = commandHandler.commandsByCategory[cbc] || commandHandler.commands.slash_interaction;

    const slashCommands = commands.filter((c: SlashCommand) => !c.props?.ownerOnly).toJSON();

    const embeds = [
      new EmbedBuilder()
        .setColor('Random')
        .setFields(this.convertCommandsToEmbedFields(slashCommands, p))
        .setTitle(this.t('konanSupport', { locale })),
    ];

    const components = message.components.map(row => {
      if (row.components[0].type !== ComponentType.Button) return row;

      if (row.components.every(element => element.customId !== customId)) return row;

      return new ActionRowBuilder<ButtonBuilder>()
        .setComponents(this.setPageButtons({
          category: cbc,
          page: p,
          total: Math.floor(slashCommands.length / this.limit),
        }));
    });

    return interaction.update({ components, embeds });
  }

  convertCommandsToEmbedFields(
    commands: SlashCommand[],
    page = 0,
    fields: APIEmbedField[] = [],
  ): APIEmbedField[] {
    for (let i = (page * this.limit); i < commands.length; i++) {
      const { data } = commands[i];

      fields.push({
        name: `${data.name}`,
        value: `${data.description}`.slice(0, 1024),
        inline: false,
      });

      if (fields.length === this.limit) break;
    }

    return fields;
  }

  setPageButtons({ category, page, total }: { category: string; page: number; total: number }) {
    return [
      new ButtonBuilder()
        .setCustomId(JSON.stringify({ c: this.data.name, cbc: category, sc: 'commands', p: page - 1 }))
        .setDisabled(page < 1)
        .setLabel('<')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId(JSON.stringify({ c: '' }))
        .setDisabled(true)
        .setStyle(ButtonStyle.Secondary)
        .setLabel(`${page + 1}/${total + 1}`),
      new ButtonBuilder()
        .setCustomId(JSON.stringify({ c: this.data.name, cbc: category, sc: 'commands', p: page + 1 }))
        .setDisabled(page >= total)
        .setLabel('>')
        .setStyle(ButtonStyle.Secondary),
    ];
  }
}