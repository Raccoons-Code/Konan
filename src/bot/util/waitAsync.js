/**
 * @deprecated use waitAsyncV2 instead
 * @description wait a time in miliseconds
 * @param {Miliseconds<number>} [ms]
 * @async
 */
module.exports = (ms = 0) => new Promise(r => setTimeout(r, ms));