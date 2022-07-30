const Emoji = new class Emoji {
  [x: string]: string;
  Danger = '❌';
  Error = '❌';
  Info = '💬';
  Success = '✅';
  Warning = '⚠️';
  online = '🟢';
  offline = '⚫';
  idle = '🟠';
  dnd = '🔴';
};

export default Emoji;