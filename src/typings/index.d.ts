export interface Stats {
  channels?: number
  guilds?: number
  members?: number
}

export interface FetchStatsOptions {
  loop?: boolean
}

export interface PrimeResolveOptions {
  all?: boolean
}

export interface SelectRolesCustomId {
  /** command */
  c: string
  count: number
  /** date */
  d: number
}

export interface SelectRolesItemOptionValue {
  count: number
  /** date */
  d: number
  roleId: string
}

export interface RolesManager {
  add: string[]
  remove: string[]
}

export interface ButtonRolesCustomId {
  /** command */
  c: string
  count: number
  /** date */
  d: number
  roleId: string
}

export interface MoviesCustomId {
  /** command */
  c: string
  d: number
  /** offset */
  o: number
  /** page */
  p: number
  target: number
}