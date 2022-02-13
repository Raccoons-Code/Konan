const Translator = require('./src');
const resources = require('./resources');

Translator.init({ resources, capitalize: true });

module.exports = Translator;