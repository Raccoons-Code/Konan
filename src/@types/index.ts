export * from "./application";
export * from "./customid";
export * from "./handlers";
export * from "./structures";
export * from "./util";

export interface BaseProcessMessage {
  [k: string]: any
  id: number
  action?: string
  actionType?: string
  data?: unknown
  error?: any
  fromShard: number
  fromWorker?: number
  origin?: string
  replied?: boolean
  replyShard?: number
  replyWorker?: number
  toShard?: number
  toWorker?: number
}
