/**
 * @param {string} string
 * @return {boolean}
 */
module.exports = (string) => {
  try {
    JSON.parse(string);
    return true;
  } catch {
    return false;
  }
};