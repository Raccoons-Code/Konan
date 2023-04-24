import { Message } from "discord.js";
import EventEmitter from "node:events";

interface Events {
  messageCreate: [message: Message]
}

interface DMForward {
  emit: (<K extends keyof Events>(event: K, ...args: Events[K]) => boolean) &
  (<S extends string | symbol>(event: Exclude<S, keyof Events>, ...args: any[]) => boolean);
  off: (<K extends keyof Events>(event: K, listener: (...args: Events[K]) => void) => this) &
  (<S extends string | symbol>(event: Exclude<S, keyof Events>, listener: (...args: any[]) => void) => this);
  on: (<K extends keyof Events>(event: K, listener: (...args: Events[K]) => void) => this) &
  (<S extends string | symbol>(event: Exclude<S, keyof Events>, listener: (...args: any[]) => void) => this);
  once: (<K extends keyof Events>(event: K, listener: (...args: Events[K]) => void) => this) &
  (<S extends string | symbol>(event: Exclude<S, keyof Events>, listener: (...args: any[]) => void) => this);
  removeAllListeners: (<K extends keyof Events>(event?: K) => this) &
  (<S extends string | symbol>(event?: Exclude<S, keyof Events>) => this);
  removeListener: (<K extends keyof Events>(event: K, listener: (...args: Events[K]) => void) => this) &
  (<S extends string | symbol>(event: Exclude<S, keyof Events>, listener: (...args: any[]) => void) => this);
}

class DMForward extends EventEmitter {
  constructor() {
    super({ captureRejections: true });
  }
}

const dMForward = new DMForward();

export default dMForward;
