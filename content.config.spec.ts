// @vitest-environment node
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { parse } from 'yaml'
import { describe, expect, it } from 'vitest'
import { aboutSchema, indexSchema, pagesSchema, projectSchema } from './content.schemas'

const locales = ['uk', 'en', 'pl'] as const

const contentDir = (locale: string, ...parts: string[]) =>
  join(import.meta.dirname, 'content', locale, ...parts)
const readYml = (locale: string, file: string) =>
  parse(readFileSync(contentDir(locale, file), 'utf8'))
const projectFiles = (locale: string) =>
  readdirSync(contentDir(locale, 'projects')).filter(f => f.endsWith('.yml'))

describe('project content files', () => {
  for (const locale of locales) {
    const files = projectFiles(locale)

    it(`has project files for locale "${locale}"`, () => {
      expect(files.length).toBeGreaterThan(0)
    })

    for (const file of files) {
      it(`${locale}/${file} matches the project schema with real values`, () => {
        const raw = readFileSync(contentDir(locale, 'projects', file), 'utf8')
        const data = parse(raw)

        const result = projectSchema.safeParse(data)
        expect(result.success, JSON.stringify(result.error?.issues)).toBe(true)
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

  it('project slugs are identical across locales', () => {
    const slugSets = locales.map(l => projectFiles(l).sort())
    for (const slugs of slugSets) {
      expect(slugs).toEqual(slugSets[0])
    }
  })
})

describe('localized page content', () => {
  const pageSchemas = [
    ['index.yml', indexSchema],
    ['about.yml', aboutSchema],
    ['projects.yml', pagesSchema]
  ] as const

  for (const locale of locales) {
    for (const [file, schema] of pageSchemas) {
      it(`${locale}/${file} matches its schema`, () => {
        const result = schema.safeParse(readYml(locale, file))
        expect(result.success, JSON.stringify(result.error?.issues)).toBe(true)
      })
    }

    it(`${locale}/about.yml images are site-local paths (no external hotlinks)`, () => {
      const result = aboutSchema.safeParse(readYml(locale, 'about.yml'))
      expect(result.success, JSON.stringify(result.error?.issues)).toBe(true)
      if (!result.success) return
      for (const image of result.data.images) {
        expect(image.src.startsWith('/')).toBe(true)
      }
    })
  }
})
