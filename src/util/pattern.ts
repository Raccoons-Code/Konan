export = new class {
  /** @pattern /([\w\W]{0,4096})/ */
  content = /([\w\W]{0,4096})/;
  /** @pattern /(?:(?:([^|]{0,256}))(?:\|?([\w\W]{0,4096})))/ */
  embed = /(?:(?:([^|]{0,256}))(?:\|?([\w\W]{0,4096})))/;
  /** @pattern /([\w\W]{0,4096})/ */
  embedDescription = /([\w\W]{0,4096})/;
  /** @pattern /([\w\W]{0,256})/ */
  embedTitle = /([\w\W]{0,256})/;
  /** @pattern /^((?:class\s*)(\s+(?!extends)\w+\s*)?(?:(?:\s+extends)(\s+\w+\s*))?){/ */
  isClass = /^((?:class\s*)(\s+(?!extends)\w+\s*)?(?:(?:\s+extends)(\s+\w+\s*))?){/;
  /** @pattern /([\w\W]{0,100})/ */
  label = /([\w\W]{0,100})/;
  /** @pattern /([\w\W]{0,84})/ */
  labelLimit = /([\w\W]{0,84})/;
  /** @pattern /(.+?)(?:\s(\d+))+?/ */
  labelWithCount = /(.+?)(?:\s(\d+))+?/;
  /** @pattern /(on(?:ce)?)/ */
  listeners = /(on(?:ce)?)/;
  /** @pattern /<@!?&?(\d{17,})>/g */
  mentions = /<@!?&?(\d{17,})>/g;
  /** @pattern /(?:(?:\/)?(\d+))+/ */
  messageURL = /(?:(?:\/)?(\d+))+/;
};