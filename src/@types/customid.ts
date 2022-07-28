export interface BanCustomId extends BaseComponentCustomId {
  a: boolean
}

export interface BaseComponentCustomId {
  /** command */
  c: string
  /** subcommand */
  sc: string
  /** subcommandgroup */
  scg: string
}

export interface ButtonRolesCustomId extends BaseComponentCustomId {
  count: number
  id: string
  /** @deprecated Use id instead! d22m07y2022 */
  roleId?: string
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