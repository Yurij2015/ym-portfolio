import { defineCollection, defineContentConfig, z } from '@nuxt/content'

const createBaseSchema = () => z.object({
  title: z.string(),
  description: z.string()
})

const createButtonSchema = () => z.object({
  label: z.string(),
  icon: z.string().optional(),
  to: z.string().optional(),
  color: z.enum(['primary', 'neutral', 'success', 'warning', 'error', 'info']).optional(),
  size: z.enum(['xs', 'sm', 'md', 'lg', 'xl']).optional(),
  variant: z.enum(['solid', 'outline', 'subtle', 'soft', 'ghost', 'link']).optional(),
  target: z.enum(['_blank', '_self']).optional()
})

const createImageSchema = () => z.object({
  src: z.string().editor({ input: 'media' }),
  alt: z.string()
})

const createAuthorSchema = () => z.object({
  name: z.string(),
  description: z.string().optional(),
  username: z.string().optional(),
  twitter: z.string().optional(),
  to: z.string().optional(),
  avatar: createImageSchema().optional()
})

const createTestimonialSchema = () => z.object({
  quote: z.string(),
  author: createAuthorSchema()
})

const indexSchema = z.object({
  seo: createBaseSchema().optional(),
  hero: z.object({
    links: z.array(createButtonSchema()),
    images: z.array(createImageSchema())
  }),
  about: createBaseSchema(),
  experience: createBaseSchema().extend({
    items: z.array(z.object({
      date: z.string(),
      position: z.string(),
      company: z.object({
        name: z.string(),
        url: z.string(),
        logo: z.string().editor({ input: 'icon' }),
        color: z.string()
      })
    }))
  }),
  testimonials: z.array(createTestimonialSchema()),
  faq: createBaseSchema().extend({
    categories: z.array(
      z.object({
        title: z.string().nonempty(),
        questions: z.array(
          z.object({
            label: z.string().nonempty(),
            content: z.string().nonempty()
          })
        )
      }))
  }).optional()
})

const projectSchema = z.object({
  title: z.string().nonempty(),
  description: z.string().nonempty(),
  image: z.string().nonempty().editor({ input: 'media' }),
  url: z.string().nonempty(),
  tags: z.array(z.string()),
  date: z.date(),
  featured: z.boolean().optional(),
  stack: z.array(z.object({
    name: z.string(),
    icon: z.string().editor({ input: 'icon' })
  })).optional(),
  links: z.array(createButtonSchema()).optional()
})

const pagesSchema = z.object({
  seo: createBaseSchema().optional(),
  links: z.array(createButtonSchema())
})

const aboutSchema = z.object({
  seo: createBaseSchema().optional(),
  content: z.object({}),
  images: z.array(createImageSchema())
})

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
    })]
  ])
)

export default defineContentConfig({
  collections: localizedCollections
})
