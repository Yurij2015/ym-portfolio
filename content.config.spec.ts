// @vitest-environment node
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { parse } from 'yaml'
import { describe, expect, it } from 'vitest'
import { aboutSchema, indexSchema, pagesSchema, projectSchema, serviceDirections, serviceSchema, serviceSettingsSchema } from './content.schemas'

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

describe('service content files', () => {
  it('requires an explicit boolean opt-in for indexing', () => {
    const { indexable: _listIndexable, ...settings } = readYml('uk', 'services.yml') as Record<string, unknown>
    expect(serviceSettingsSchema.parse(settings).indexable).toBe(false)
    expect(serviceSettingsSchema.parse({ ...settings, indexable: false }).indexable).toBe(false)
    expect(serviceSettingsSchema.parse({ ...settings, indexable: true }).indexable).toBe(true)
    expect(serviceSettingsSchema.safeParse({ ...settings, indexable: 'true' }).success).toBe(false)

    const directions = settings.directions as Record<string, Record<string, unknown>>
    const { indexable: _directionIndexable, ...development } = directions.development!
    const parsed = serviceSettingsSchema.parse({ ...settings, directions: { ...directions, development } })
    expect(parsed.directions.development.indexable).toBe(false)

    const service = readYml('uk', 'services/laravel-development.yml') as Record<string, unknown>
    const { indexable: _indexable, ...legacyService } = service
    expect(serviceSchema.parse(legacyService).indexable).toBe(false)
    expect(serviceSchema.parse({ ...legacyService, indexable: true }).indexable).toBe(true)
  })

  for (const locale of locales) {
    it(`${locale}/services.yml matches the service list settings schema`, () => {
      expect(serviceSettingsSchema.safeParse(readYml(locale, 'services.yml')).success).toBe(true)
    })
  }

  const serviceFiles = (locale: string) =>
    readdirSync(contentDir(locale, 'services')).filter(f => f.endsWith('.yml')).sort()

  it('has the same service slugs in every locale', () => {
    const [uk, ...others] = locales.map(serviceFiles)
    expect(uk!.length).toBeGreaterThan(0)
    for (const files of others) {
      expect(files).toEqual(uk)
    }
  })

  // /services/development and /services/support are static pages that
  // would shadow a service with the same slug.
  it('has no service slug equal to a direction slug', () => {
    const slugs = serviceFiles('uk').map(f => f.replace(/\.yml$/, ''))
    for (const direction of serviceDirections) {
      expect(slugs).not.toContain(direction)
    }
  })

  const groupOf = (locale: string, slug: string) =>
    (readYml(locale, `services/${slug}.yml`) as { group: string }).group

  it('assigns every service to the same direction in every locale', () => {
    for (const file of serviceFiles('uk')) {
      const slug = file.replace(/\.yml$/, '')
      expect(serviceDirections).toContain(groupOf('uk', slug))
      for (const locale of locales) {
        expect(groupOf(locale, slug), `${locale}/${slug}`).toBe(groupOf('uk', slug))
      }
    }
  })

  it('features only existing services of the matching direction, identically in every locale', () => {
    const featuredOf = (locale: string) => {
      const settings = serviceSettingsSchema.parse(readYml(locale, 'services.yml'))
      return Object.fromEntries(serviceDirections.map(d => [d, settings.directions[d].featured]))
    }
    const uk = featuredOf('uk')
    for (const direction of serviceDirections) {
      for (const slug of uk[direction]!) {
        expect(serviceFiles('uk'), slug).toContain(`${slug}.yml`)
        expect(groupOf('uk', slug), slug).toBe(direction)
      }
    }
    for (const locale of locales) {
      expect(featuredOf(locale), locale).toEqual(uk)
    }
  })

  for (const locale of locales) {
    for (const file of serviceFiles(locale)) {
      it(`${locale}/${file} matches the service schema`, () => {
        const result = serviceSchema.safeParse(readYml(locale, `services/${file}`))
        expect(result.success, JSON.stringify(result.error?.issues)).toBe(true)
      })
    }
  }
})
