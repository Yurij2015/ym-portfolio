// @vitest-environment node
import { describe, expect, it } from 'vitest'
import uk from './locales/uk.json'
import en from './locales/en.json'
import pl from './locales/pl.json'

const flattenKeys = (obj: Record<string, unknown>, prefix = ''): string[] => {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return flattenKeys(value as Record<string, unknown>, path)
    }
    return [path]
  })
}

describe('locale key parity', () => {
  const ukKeys = flattenKeys(uk).sort()
  const enKeys = flattenKeys(en).sort()
  const plKeys = flattenKeys(pl).sort()

  it('en has the same keys as uk', () => {
    expect(enKeys).toEqual(ukKeys)
  })

  it('pl has the same keys as uk', () => {
    expect(plKeys).toEqual(ukKeys)
  })
})
