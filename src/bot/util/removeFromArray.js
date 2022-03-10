/**
 * @param {Array} array
 * @return {Array}
 */
module.exports = (array, target) => {
  while (array.includes(target))
    array.splice(array.indexOf(target), 1);

  return array;
};