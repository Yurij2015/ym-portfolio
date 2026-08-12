// @vitest-environment node
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { parse } from 'yaml'
import { describe, expect, it } from 'vitest'
import { projectSchema } from './content.schemas'

const locales = ['uk', 'en', 'pl'] as const

describe('project content files', () => {
  for (const locale of locales) {
    const dir = join(import.meta.dirname, 'content', locale, 'projects')
    const files = readdirSync(dir).filter(f => f.endsWith('.yml'))

    it(`has project files for locale "${locale}"`, () => {
      expect(files.length).toBeGreaterThan(0)
    })

    for (const file of files) {
      it(`${locale}/${file} matches the project schema with real values`, () => {
        const raw = readFileSync(join(dir, file), 'utf8')
        const data = parse(raw)

        const result = projectSchema.safeParse(data)
        expect(result.success).toBe(true)
        if (!result.success) return

        expect(result.data.title).not.toBe('')
        expect(result.data.description).not.toBe('')
        expect(result.data.image).not.toBe('')
        expect(result.data.url).not.toBe('')

        const year = new Date(result.data.date).getFullYear()
        expect(year).toBeGreaterThan(2000)
        expect(year).toBeLessThan(2100)
      })
    }
  }
})
