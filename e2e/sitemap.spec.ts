import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { expect, test } from '@playwright/test'
import { parse } from 'yaml'

const projectsDir = join(import.meta.dirname, '../content/en/projects')
const projectFiles = readdirSync(projectsDir).filter(f => f.endsWith('.yml'))
const projectSlugs = projectFiles.map(f => f.replace(/\.yml$/, ''))

const latestContentDate = projectFiles
  .map(f => new Date(parse(readFileSync(join(projectsDir, f), 'utf8')).date))
  .reduce((a, b) => (a > b ? a : b))
  .toISOString()

const LOCALES = ['uk-UA', 'en-US', 'pl-PL']

test('sitemap.xml serves XML with all localized routes and hreflang alternates', async ({ request }) => {
  const response = await request.get('/sitemap.xml')
  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('application/xml')

  const xml = await response.text()

  const urlCount = (xml.match(/<url>/g) ?? []).length
  expect(urlCount).toBe(3 * (3 + projectSlugs.length))

  for (const slug of projectSlugs) {
    expect(xml).toContain(`/projects/${slug}</loc>`)
  }

  for (const iso of [...LOCALES, 'x-default']) {
    expect(xml).toContain(`hreflang="${iso}"`)
  }
})

test('sitemap lastmod is derived from content dates, not the request time', async ({ request }) => {
  const xml = await (await request.get('/sitemap.xml')).text()
  const lastmods = [...xml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map(m => m[1])

  expect(lastmods.length).toBeGreaterThan(0)
  for (const lastmod of lastmods) {
    expect(lastmod).toBe(latestContentDate)
  }
})
