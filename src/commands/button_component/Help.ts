import { ButtonInteraction, Client, EmbedFieldData, MessageButton } from 'discord.js';
import { HelpButtonCustomId } from '../../@types';
import { ButtonComponentInteraction, SlashCommand } from '../../structures';
import Util from '../../util';

export default class Help extends ButtonComponentInteraction {
  limit = Util.Constants.helpPageLimit;

  constructor(client: Client) {
    super(client, {
      name: 'help',
      description: 'Help Button',
    });
  }

  async execute(interaction: ButtonInteraction<'cached'>) {
    const { customId } = interaction;

    const { sc } = JSON.parse(customId);

    this[<'commands'>sc]?.(interaction);
  }

  async commands(interaction: ButtonInteraction<'cached'>) {
    const { client, customId, locale, message } = interaction;

    const { cbc, p } = <HelpButtonCustomId>JSON.parse(customId);

    const commands = client.commandsByCategory[cbc] || client.commands.slash_interaction;

    const slashCommands = commands.filter((c: SlashCommand) => !c.props?.ownerOnly).toJSON();

    message.embeds[0]
      .setColor('RANDOM')
      .setFields(this.convertCommandsToEmbedFields(slashCommands, p))
      .setTitle(this.t('konanSupport', { locale }));

    message.components.map(c => {
      if (c.components[0].type !== 'BUTTON') return c;

      c.setComponents(this.setPageButtons({
        category: cbc,
        page: p,
        total: Math.floor(slashCommands.length / this.limit),
      }));

      return c;
    });

    await interaction.update({ components: message.components, embeds: message.embeds });
  }

  convertCommandsToEmbedFields(
    commands: SlashCommand[],
    page = 0,
    fields: EmbedFieldData[] = [],
  ): EmbedFieldData[] {
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

  setPageButtons({ category, page, total }: { category: string, page: number, total: number }) {
    return [
      new MessageButton()
        .setCustomId(JSON.stringify({ c: this.data.name, cbc: category, sc: 'commands', p: page - 1 }))
        .setDisabled(page < 1)
        .setLabel('Back')
        .setStyle('SECONDARY'),
      new MessageButton()
        .setCustomId(JSON.stringify({ c: '' }))
        .setDisabled(true)
        .setStyle('SECONDARY')
        .setLabel(`${page + 1}/${total + 1}`),
      new MessageButton()
        .setCustomId(JSON.stringify({ c: this.data.name, cbc: category, sc: 'commands', p: page + 1 }))
        .setDisabled(page >= total)
        .setLabel('Next')
        .setStyle('SECONDARY'),
    ];
  }
}