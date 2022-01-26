/**
 * @param {Number} [max]
 * @param {Number} [min]
 * @return {Number}
 */
module.exports = (max = 0, min = 0) => {
    const mathRandom = Math.floor((max * Math.random()) + min);
    if (mathRandom > max) return max;

    return mathRandom;
};