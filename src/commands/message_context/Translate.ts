import { codeBlock, ContextMenuCommandBuilder } from '@discordjs/builders';
import translate, { languages } from '@vitalets/google-translate-api';
import { Client, MessageContextMenuInteraction, MessageEmbed } from 'discord.js';
import { MessageContextMenu } from '../../structures';

const langs = Object.keys(languages)
  .filter(l => !/(isSupported|getCode)/.test(l));

export default class extends MessageContextMenu {
  constructor(client: Client) {
    super(client);

    this.data = new ContextMenuCommandBuilder().setName('Translate')
      .setNameLocalizations(this.getLocalizations('translateName'))
      .setType(3);
  }

  async execute(interaction: MessageContextMenuInteraction): Promise<any> {
    await interaction.deferReply({ ephemeral: true });

    const { locale, targetMessage } = interaction;

    const to = langs.find(l => RegExp(l, 'i').test(locale));

    const translation = await translate(targetMessage.content, { from: 'auto', to });

    return interaction.editReply({
      embeds: [
        new MessageEmbed()
          .setColor('RANDOM')
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