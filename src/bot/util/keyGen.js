/**
 * @param {number} [length]
 * @param {2|36} [toString=36]
 * @return {Random<string|number>}
 */
module.exports = (length, toString = 36) => Math.random().toString(toString).substring(2, length);