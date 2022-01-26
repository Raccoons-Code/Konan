/**
 * @param {Array} array
 * @return {Array<duplicates>}
 */
module.exports = array => array.filter((v, i, a) => a.indexOf(v) !== i);