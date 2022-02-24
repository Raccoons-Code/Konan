/**
 * @param {Array} array
 * @return {boolean}
 */
module.exports = (array) => new Set(array).size !== array.length;