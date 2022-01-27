const Translator = require('./src');
const resources = require('./resources');

const translator = Translator.init({ resources });

module.exports = translator;