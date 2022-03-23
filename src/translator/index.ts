import resources from './resources';
import Translator from './src';

Translator.init({ resources, capitalize: true });

export default Translator;
export * from './src';
