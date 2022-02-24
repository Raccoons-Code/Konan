/**
 * @param {Timestamp<number>} oldDate
 * @param {Timestamp<number>} [newDate]
 * @return {boolean}
 */
module.exports = (oldDate, newDate = Date.now()) => new Date(oldDate).setHours(0, 0, 0, 0) === new Date(newDate).setHours(0, 0, 0, 0);