export * from "./application";
export * from "./customid";
export * from "./handlers";
export * from "./structures";
export * from "./util";

export interface BaseProcessMessage<T = unknown> {
  [k: string]: any
  id: number
  fromShard: number
  action?: string
  actionType?: string
  data?: T
  error?: any
  fromWorker?: number
  origin?: string
  replied?: boolean
  replyShard?: number
  replyWorker?: number
  toShard?: number
  toWorker?: number
}

export interface SingleProcessMessage<T = unknown> extends Partial<BaseProcessMessage<T>> {
  toShard: number
}

export interface MultiProcessMessage<T = unknown> extends Partial<BaseProcessMessage<T>> {
}
