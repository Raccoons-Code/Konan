import { Locale } from 'discord.js';
import resources from './resources';
import Translator from './src';

const Locales = { ...Locale, English: 'en' };

Translator.init({ resources, capitalize: true, Locales });

export default Translator;
export * from './src';
