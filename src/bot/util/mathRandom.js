/**
 * @param {number} max
 * @param {number} [min=1] [min=1]
 * @return {number}
 */
module.exports = (max, min = 1) => Math.min(Math.floor((max * Math.random()) + min), max);