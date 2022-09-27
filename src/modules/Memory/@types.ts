export interface MemoryGameCreateOptions {
  emojis?: string[];
  mode?: MemoryGameMode
  time?: Date | number | string | null;
}

export interface MemoryGameEmojisType {
  [x: string]: string | string[]
  'question': string,
  'gray_question': string,
  'animal': string[],
  'clock': string[],
  'family': string[],
  'flag': string[],
  'fruit': string[],
  'heart': string[],
  'number': string[],
  'smile': string[],
  'sport': string[],
}

export enum MemoryGameMode {
  solo,
  limited,
  coop,
  comp,
}