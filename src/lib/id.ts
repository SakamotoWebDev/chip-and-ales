import { nanoid } from 'nanoid'

export function generateId(prefix = ''): string {
  return `${prefix}${nanoid(6)}`
}