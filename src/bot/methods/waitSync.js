/**
 * @param {Miliseconds<number>} [ms]
 */
module.exports = (ms = 0) => {
	const end = Date.now() + ms;
	while (Date.now() < end) continue;
};