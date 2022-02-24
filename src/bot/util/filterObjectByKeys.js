/**
 * @param {object} object
 * @param {Array} keys
 */
module.exports = (object, keys) => keys.reduce((acc, key) => {
  if (typeof object[key] !== 'undefined')
    acc[key] = object[key];

  return acc;
}, {});