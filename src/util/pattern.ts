export = new class pattern {
  /** @pattern /([\w\W]{0,80})/ */
  buttonLabel = /([\w\W]{0,80})/;
  /**
   * @description A label regex pattern with space for max safe integer value (2^53-1)
   * @pattern /([\w\W]{0,63})/
   */
  buttonLabelLimited = /([\w\W]{0,63})/;
  /** @pattern /\[(<.*?:.*?:.*?>)?(.*?)\]\((?:(.*?)):\/?\/?(.*?)\)/ */
  componentLink = /\[(<.*?:.*?:.*?>)?(.*?)\]\((?:(.*?)):\/?\/?(.*?)\)/;
  /** @pattern /\[(<.*?:.*?:.*?>)?(.*?)\]\((?:(.*?)):\/?\/?(.*?)\)/g */
  componentLinkG = /\[(<.*?:.*?:.*?>)?(.*?)\]\((?:(.*?)):\/?\/?(.*?)\)/g;
  /** @pattern /\[\s*(<.*?:.*?:.*?>)?\s*(.*?)\s*\]\(\s*(?:(button|https?)):\/?\/?(.*?)\)/ */
  componentCommandNameLink = /\[\s*(<.*?:.*?:.*?>)?\s*(.*?)\s*\]\(\s*(?:(button|https?)):\/?\/?(.*?)\)/;
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
  /**
   * @description A label regex pattern with space for max safe integer value (2^53-1)
   * @pattern /([\w\W]{0,83})/
   */
  labelLimited = /([\w\W]{0,83})/;
  /** @pattern /(.+)(?:\s(\d+))/ */
  labelWithCount = /(.+)(?:\s(\d+))/;
  /** @pattern /(on(?:ce)?)/ */
  listeners = /(on(?:ce)?)/;
  /** @pattern /<@!?&?(\d{17,})>/g */
  mentions = /<@!?&?(\d{17,})>/g;
  /** @pattern /(?:(?:\/)?(\d{17,}))+/ */
  messageURL = /(?:(?:\/)?(\d{17,}))+/;
};