/**
 * @param {Array} array
 * @param {Number} [length]
 * @return {Array<Array>}
 */
module.exports = (array, length = 10) => {
	const groups = [];

	for (let i = 0; i < array.length; i += length) { groups.push(array.slice(i, (i + length))); }

	return groups;
};