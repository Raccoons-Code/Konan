/**
 * @param {Timestamp<Number>} oldDate
 * @param {Timestamp<Number>} [newDate]
 * @return {Boolean}
 */
module.exports = (oldDate, newDate = Date.now()) => new Date(oldDate).setHours(0, 0, 0, 0) === new Date(newDate).setHours(0, 0, 0, 0);