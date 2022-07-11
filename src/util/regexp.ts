export = new class regexp {
  /** @pattern /([\w\W]{0,80})/ */
  buttonLabel = /([\w\W]{0,80})/;
  /**
   * @description A label regex pattern with space for max safe integer value (2^53-1)
   * @pattern /([\w\W]{0,63})/
   */
  buttonLabelLimited = /([\w\W]{0,63})/;
  /** @pattern /\[(<.*?:.*?:.*?>|:.*?:)?\s*(.+?)\s*\]\((?:(.*?)):\/?\/?(.*?)\)/ */
  componentLink = /\[(<.*?:.*?:.*?>|:.*?:)?\s*(.+?)\s*\]\((?:(.*?)):\/?\/?(.*?)\)/;
  /** @pattern /\[(<.*?:.*?:.*?>|:.*?:)?\s*(.+?)\s*\]\((?:(.*?)):\/?\/?(.*?)\)/g */
  componentLinkG = /\[(<.*?:.*?:.*?>|:.*?:)?\s*(.+?)\s*\]\((?:(.*?)):\/?\/?(.*?)\)/g;
  /** @pattern /\[\s*(<.*?:.*?:.*?>|:.*?:)?\s*(.+?)\s*\]\(\s*(?:(button|https?)):\/?\/?(.*?)\)/ */
  componentCommandNameLink = /\[\s*(<.*?:.*?:.*?>|:.*?:)?\s*(.+?)\s*\]\(\s*(?:(button|https?)):\/?\/?(.*?)\)/;
  /** @pattern /([\w\W]{0,4096})/ */
  content = /([\w\W]{0,4096})/;
  /**
   * @title 256
   * @description 4096
   * @total 4352
   * @pattern /(?:(?:(?<title>[^|]{0,256}))(?:\|?(?<description>[\w\W]{0,4096})))/
   */
  embed = /(?:(?:(?<title>[^|]{0,256}))(?:\|?(?<description>[\w\W]{0,4096})))/;
  /** @pattern /([\w\W]{0,4096})/ */
  embedDescription = /([\w\W]{0,4096})/;
  /** @pattern /([\w\W]{0,256})/ */
  embedTitle = /([\w\W]{0,256})/;
  /** @pattern /<?(?:(?<animated>a))?(?::?(?<name>\p{S}|\w{2,32}):?)(?<id>\d{17,19})?>?/u */
  emoji = /<?(?:(?<animated>a))?(?::?(?<name>\p{S}|\w{2,32}):?)(?<id>\d{17,19})?>?/u;
  /** @pattern /^(?<all>(?:class)(?:\s+(?<name>(?!extends)\w+))?(?:(?:\s+extends)\s+(?<extended>\w+))?)\s*{/ */
  isClass = /^(?<all>(?:class)(?:\s+(?<name>(?!extends)\w+))?(?:(?:\s+extends)\s+(?<extended>\w+))?)\s*{/;
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
  /** @pattern /<(@|#)!?&?(\d{17,})>/g */
  mentions = /<(@|#)!?&?(\d{17,})>/g;
  /** @pattern /(?:(?:\/)?(\d{17,}))+/ */
  messageURL = /(?:(?:\/)?(\d{17,}))+/;
};