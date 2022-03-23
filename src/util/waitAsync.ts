/** @deprecated use waitAsyncV2 instead */
export = (ms = 0) => new Promise(r => setTimeout(r, ms));