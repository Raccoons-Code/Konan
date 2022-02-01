/**
 * @param {number} [max]
 * @param {number} [min]
 * @return {number}
 */
module.exports = (max = 0, min = 0) => {
    const mathRandom = Math.floor((max * Math.random()) + min);

    if (mathRandom > max) return max;

    return mathRandom;
};