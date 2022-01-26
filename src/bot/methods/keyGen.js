/**
 * @param {Object} params
 * @param {Number} [params.length]
 * @param {2|36} [params.toString]
 * @return {Random<String|Number>}
 */
module.exports = ({ length, toString = 36 }) => Math.random().toString(toString).substring(2, length);