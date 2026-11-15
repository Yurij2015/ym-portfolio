import { z } from '@nuxt/content'

const createBaseSchema = () => z.object({
  title: z.string(),
  description: z.string().editor({ input: 'textarea' })
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
  rating: z.number().min(1).max(5).optional(),
  author: createAuthorSchema()
})

export const indexSchema = z.object({
  seo: createBaseSchema().optional(),
  hero: z.object({
    links: z.array(createButtonSchema()),
    images: z.array(createImageSchema())
  }),
  about: createBaseSchema(),
  // The timeline replaces the section description slot, so it stays optional
  experience: createBaseSchema().extend({
    description: z.string().optional(),
    items: z.array(z.object({
      date: z.string(),
      position: z.string(),
      current: z.boolean().optional(),
      description: z.string().optional(),
      company: z.object({
        name: z.string(),
        url: z.string().optional(),
        logo: z.string().editor({ input: 'icon' }),
        color: z.string()
      })
    })),
    link: createButtonSchema().optional()
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

export const projectSchema = z.object({
  title: z.string().nonempty(),
  description: z.string().nonempty().editor({ input: 'textarea' }),
  image: z.string().nonempty().editor({ input: 'media' }),
  url: z.string().nonempty(),
  tags: z.array(z.string()),
  date: z.string(),
  featured: z.boolean().optional(),
  stack: z.array(z.object({
    name: z.string(),
    icon: z.string().editor({ input: 'icon' })
  })).optional(),
  links: z.array(createButtonSchema()).optional(),
  content: z.string().optional()
})

export const technologySchema = z.object({
  title: z.string().nonempty(),
  description: z.string().nonempty().editor({ input: 'textarea' }),
  icon: z.string().editor({ input: 'icon' }),
  category: z.enum(['backend', 'frontend', 'database', 'infrastructure', 'tools']),
  since: z.string().optional(),
  projects: z.array(z.string()),
  links: z.array(createButtonSchema()).optional(),
  faq: z.array(z.object({
    label: z.string().nonempty(),
    content: z.string().nonempty().editor({ input: 'textarea' })
  })).optional(),
  updated: z.string().optional(),
  content: z.string().editor({ input: 'textarea' })
})

// Default to noindex until the editor explicitly approves each localized page.
const serviceIndexingSchema = z.boolean().default(false).editor({
  label: 'Дозволити індексацію / Allow indexing',
  description: 'Увімкніть після перевірки цієї мовної версії. Off = noindex.'
})

export const serviceDirections = ['development', 'support'] as const

const serviceDirectionSchema = z.object({
  indexable: serviceIndexingSchema,
  // Short name for breadcrumbs and links ("Розробка" / "Підтримка")
  label: z.string().nonempty(),
  title: z.string().nonempty(),
  // Meta description — keep under ~160 chars
  description: z.string().nonempty().editor({ input: 'textarea' }),
  intro: z.string().nonempty().editor({ input: 'textarea' }),
  // Service slugs shown on the /services overview for this direction
  featured: z.array(z.string().nonempty()).min(3).max(4)
})

export const serviceSettingsSchema = z.object({
  indexable: serviceIndexingSchema,
  title: z.string().nonempty(),
  description: z.string().nonempty().editor({ input: 'textarea' }),
  intro: z.string().nonempty().editor({ input: 'textarea' }),
  directions: z.object({
    development: serviceDirectionSchema,
    support: serviceDirectionSchema
  })
})

export const serviceSchema = z.object({
  indexable: serviceIndexingSchema,
  title: z.string().nonempty(),
  // Meta description — keep under ~160 chars
  description: z.string().nonempty().editor({ input: 'textarea' }),
  // Direct-answer lead shown in the hero (~35–60 words; inflected languages run shorter)
  summary: z.string().nonempty().editor({ input: 'textarea' }),
  icon: z.string().editor({ input: 'icon' }),
  group: z.enum(serviceDirections),
  order: z.number(),
  priceFrom: z.number(),
  priceCurrency: z.enum(['USD', 'PLN']).default('USD'),
  // Hourly engagements show the price per hour in the configured currency
  priceUnit: z.enum(['project', 'hour']).optional(),
  timeline: z.string().nonempty(),
  deliverables: z.array(z.string().nonempty()).min(3),
  process: z.array(z.object({
    title: z.string().nonempty(),
    description: z.string().nonempty()
  })).min(3),
  technologies: z.array(z.string()),
  projects: z.array(z.string()),
  faq: z.array(z.object({
    label: z.string().nonempty(),
    content: z.string().nonempty().editor({ input: 'textarea' })
  })).optional(),
  updated: z.string(),
  content: z.string().editor({ input: 'textarea' })
})

export const pagesSchema = z.object({
  seo: createBaseSchema().optional(),
  links: z.array(createButtonSchema())
})

export const firstWebsiteSchema = z.object({
  seo: createBaseSchema().optional(),
  content: z.string()
})

export const aboutSchema = z.object({
  seo: createBaseSchema().optional(),
  content: z.string(),
  images: z.array(createImageSchema())
})
