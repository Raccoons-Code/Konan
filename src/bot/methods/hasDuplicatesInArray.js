/**
 * @param {Array} array
 * @return {Boolean}
 */
module.exports = (array) => (new Set(array)).size !== array.length;