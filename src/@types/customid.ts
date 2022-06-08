export interface BanCustomId extends BaseComponentCustomId {
  a: boolean
}

export interface BaseComponentCustomId {
  /** command */
  c: string
  /** subcommand */
  sc: string
}

export interface ButtonRolesCustomId extends BaseComponentCustomId {
  count: number
  /** date */
  d: number
  roleId: string
}

export interface HelpButtonCustomId extends BaseComponentCustomId {
  /** Commands by category */
  cbc: string
  /** page */
  p: number
}

export interface JkpCustomId extends BaseComponentCustomId {
  /** players id */
  p: string[]
  /** value */
  v: number
}

export type InfoCustomId = BaseComponentCustomId

export interface MoviesCustomId extends BaseComponentCustomId {
  /** date */
  d: number
  /** offset */
  o: number
  /** page */
  p: number
  target: number
}

export interface SelectRolesCustomId extends BaseComponentCustomId {
  count: number
  /** date */
  d: number
}