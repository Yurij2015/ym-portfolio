// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { formatProjectYear } from './date'

describe('formatProjectYear', () => {
  it('extracts the year from an ISO date string', () => {
    expect(formatProjectYear('2024-01-15')).toBe(2024)
  })

  it('handles different valid dates', () => {
    expect(formatProjectYear('2022-03-10')).toBe(2022)
    expect(formatProjectYear('2023-06-20')).toBe(2023)
  })
})
