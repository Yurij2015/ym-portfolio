import { defineCollection, defineContentConfig } from '@nuxt/content'
import { aboutSchema, indexSchema, pagesSchema, projectSchema, serviceSchema, serviceSettingsSchema, technologySchema } from './content.schemas'

const locales = ['uk', 'en', 'pl'] as const

const localizedCollections = Object.fromEntries(
  locales.flatMap(locale => [
    [`index_${locale}`, defineCollection({
      type: 'page',
      source: `${locale}/index.yml`,
      schema: indexSchema
    })],
    [`projects_${locale}`, defineCollection({
      type: 'data',
      source: `${locale}/projects/*.yml`,
      schema: projectSchema
    })],
    [`pages_${locale}`, defineCollection({
      type: 'page',
      source: [{ include: `${locale}/projects.yml` }],
      schema: pagesSchema
    })],
    [`about_${locale}`, defineCollection({
      type: 'page',
      source: `${locale}/about.yml`,
      schema: aboutSchema
    })],
    [`technologies_${locale}`, defineCollection({
      type: 'data',
      source: `${locale}/technologies/*.yml`,
      schema: technologySchema
    })],
    [`service_settings_${locale}`, defineCollection({
      type: 'data',
      source: `${locale}/services.yml`,
      schema: serviceSettingsSchema
    })],
    [`services_${locale}`, defineCollection({
      type: 'data',
      source: `${locale}/services/*.yml`,
      schema: serviceSchema
    })]
  ])
)

export default defineContentConfig({
  collections: localizedCollections
})
