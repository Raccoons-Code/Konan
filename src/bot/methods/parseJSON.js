/**
 * @param {string} string
 * @return {object}
 */
module.exports = (string) => {
  try {
    return JSON.parse(string);
  } catch {
    return {};
  }
};