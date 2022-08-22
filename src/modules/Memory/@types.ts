export interface MemoryGameCreateOptions {
  emojis?: string[];
  mode?: MemoryGameMode | keyof typeof MemoryGameMode
  time?: Date | number | string;
}

export enum MemoryGameMode {
  solo,
  limited,
  coop,
  comp,
}