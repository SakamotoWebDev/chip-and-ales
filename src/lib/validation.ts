import { ChipResult, PuttResult } from '../types/domain'

export function isValidChipResult(chip: ChipResult): boolean {
  return chip.distance >= 0 || chip.holed === true
}

export function isValidPuttResult(putt: PuttResult): boolean {
  return typeof putt.made === 'boolean'
}