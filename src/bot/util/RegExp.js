module.exports = new class {
  constructor() {
    this.content = /([\w\W]{0,4096})/;
    this.embed = /(?:(?:([^|]{0,256}))(?:\|?([\w\W]{0,4096})))/;
    this.isClass = /^((?:class\s*)(\s+(?!extends)\w+\s*)?(?:(?:\s+extends)(\s+\w+\s*))?){/;
    this.label = /([\w\W]{0,100})/;
    this.labelWithCount = /(.+?)(?:\s(\d+))+?/;
    this.labelLimit = /([\w\W]{0,84})/;
    this.listeners = /(on(?:ce)?)/;
    this.mentions = /<@!?&?(\d{17,})>/g;
    this.messageURL = /(?:(?:\/)?(\d+))+/;
  }
};