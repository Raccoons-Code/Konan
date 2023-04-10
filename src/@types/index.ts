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
  data?: any
  error?: any
  fromCluster?: number
  fromShard: number
  fromWorker?: number
  replied?: boolean
  replyCluster?: number
  replyShard?: number
  replyWorker?: number
  toCluster?: number
  toShard?: number
  toWorker?: number
}
