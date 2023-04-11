export * from "./application";
export * from "./customid";
export * from "./handlers";
export * from "./structures";
export * from "./util";

export interface BaseProcessMessage {
  [k: string]: any
  id: number
  fromShard: number
  action?: string
  actionType?: string
  data?: unknown
  error?: any
  fromWorker?: number
  origin?: string
  replied?: boolean
  replyShard?: number
  replyWorker?: number
  toShard?: number
  toWorker?: number
}

export interface SingleProcessMessage extends Partial<BaseProcessMessage> {
  toShard: number
}

export type MultiProcessMessage = Partial<BaseProcessMessage>;
