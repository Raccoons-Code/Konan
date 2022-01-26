/**
 * @description wait a time in miliseconds
 * @async
 */
module.exports = require('util').promisify(setTimeout);