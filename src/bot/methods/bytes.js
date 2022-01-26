/**
 * @param {Number} bytes
 * @return {Array<{bytes:Number, symbol:String}>}
 */
module.exports = (bytes) => [(bytes / Math.pow(1024, Math.floor(Math.log(bytes) / Math.log(1000)))).toFixed(2),
['B', 'KB', 'MB', 'GB', 'TB'][(Math.floor(Math.log(bytes) / Math.log(1000)))]];