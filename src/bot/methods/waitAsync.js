/**
 * @deprecated use waitAsyncV2 instead
 * @description wait a time in miliseconds
 * @param {Miliseconds<Number>} [ms]
 * @async
 */
module.exports = (ms = 0) => new Promise(r => setTimeout(r, ms));