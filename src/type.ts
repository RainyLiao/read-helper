export type Direction = 'prev' | 'next' | 'first'

export interface RhOptions {
  branch: string,
  direction: Direction,
  hash: string
}
