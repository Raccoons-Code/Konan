import translate, { languages } from '@vitalets/google-translate-api';
import { ApplicationCommandType, codeBlock, ContextMenuCommandBuilder, EmbedBuilder, MessageContextMenuCommandInteraction } from 'discord.js';
import { MessageContextMenu } from '../../structures';

const langs = Object.keys(languages)
  .filter(l => !/(isSupported|getCode)/.test(l));

export default class extends MessageContextMenu {
  constructor() {
    super();

    this.data = new ContextMenuCommandBuilder().setName('Translate')
      .setNameLocalizations(this.getLocalizations('translateName'))
      .setType(ApplicationCommandType.Message);
  }

  async execute(interaction: MessageContextMenuCommandInteraction): Promise<any> {
    await interaction.deferReply({ ephemeral: true });

    const { locale, targetMessage } = interaction;

    const to = langs.find(l => RegExp(l, 'i').test(locale));

    const translation = await translate(targetMessage.content, { from: 'auto', to });

    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor('Random')
          .setDescription(`${codeBlock(translation.text.slice(0, 4089))}`)
          .setTitle([
            'Translation from',
            languages[<'auto'>translation.from.language.iso],
            'to',
            languages[<'auto'>to],
          ].join(' ')),
      ],
    });
  }
}