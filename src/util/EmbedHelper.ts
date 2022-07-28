import { APIEmbed, EmbedBuilder, EmbedData } from 'discord.js';
import { EmbedColor, EmbedType } from '../@types';
import { t } from '../translator';
import Emoji from './Emoji';

export function EmbedHelper(data?: APIEmbed | EmbedData, type: `${EmbedType}` = EmbedType.Info, locale?: string) {
  return new EmbedBuilder(data)
    .setColor(data?.color ?? EmbedColor[type])
    .setTitle(`${Emoji[type]} ${data?.title ?? t(EmbedType[type], { locale })}`);
}