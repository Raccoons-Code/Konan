const translator = require('./src');
const resources = require('./resources');

translator.init({ resources });

module.exports = translator;