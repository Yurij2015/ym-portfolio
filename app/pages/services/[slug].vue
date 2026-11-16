<script setup lang="ts">
const { locale, t } = useI18n()
const route = useRoute()
const localePath = useLocalePath()
const { global } = useAppConfig()

const slug = computed(() => String(route.params.slug))

const { data: service } = await useAsyncData(
  () => `service-${locale.value}-${slug.value}`,
  () => queryCollection(`services_${locale.value}` as 'services_uk')
    .where('stem', '=', `${locale.value}/services/${slug.value}`)
    .first(),
  { watch: [locale, slug] }
)
if (!service.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Service not found',
    fatal: true
  })
}

const { data: settings } = await useAsyncData(
  () => `service-settings-${locale.value}`,
  () => queryCollection(`service_settings_${locale.value}` as 'service_settings_uk').first(),
  { watch: [locale] }
)

// Service URLs are flat; the direction only shows up in breadcrumbs.
const direction = computed(() => {
  const key = service.value?.group
  const page = key ? settings.value?.directions?.[key] : undefined
  return key && page ? { label: page.label, path: localePath(`/services/${key}`) } : undefined
})

const lastSegment = (item: { stem?: string }) =>
  String(item.stem ?? '').split('/').pop() ?? ''

// Related slugs are curated in YAML and resolved against the collections,
// so a stale reference is skipped instead of breaking the page.
const { data: related } = await useAsyncData(
  () => `service-related-${locale.value}-${slug.value}`,
  async () => {
    const [projects, technologies] = await Promise.all([
      queryCollection(`projects_${locale.value}` as 'projects_uk').all(),
      queryCollection(`technologies_${locale.value}` as 'technologies_uk').all()
    ])
    const pick = <T extends { stem?: string }>(all: T[], slugs: string[]) =>
      slugs
        .map(s => all.find(item => lastSegment(item) === s))
        .filter((item): item is T => Boolean(item))
    return {
      projects: pick(projects, service.value?.projects ?? []),
      technologies: pick(technologies, service.value?.technologies ?? [])
    }
  },
  { watch: [locale, slug] }
)

const title = service.value.title
const description = service.value.description

const origin = (useRuntimeConfig().public.siteUrl as string) || useRequestURL().origin
const serviceUrl = `${origin}${route.path}`

const robots = computed(() => service.value?.indexable === true ? 'index, follow' : 'noindex, follow')
useResponseHeader('X-Robots-Tag').value = robots.value

useSeoMeta({
  robots: () => robots.value,
  title,
  ogTitle: title,
  description,
  ogDescription: description
})

defineOgImage('Portfolio', {
  title,
  description,
  headline: direction.value?.label ?? t('nav.services')
}, { alt: title })

const jsonLd = computed(() => {
  const graph: Record<string, unknown>[] = [
    {
      '@type': 'Service',
      'name': title,
      description,
      'url': serviceUrl,
      'inLanguage': locale.value,
      'serviceType': title,
      'areaServed': 'Worldwide',
      'provider': {
        '@type': 'Person',
        'name': 'Yurii Mokryi',
        'url': origin,
        'jobTitle': 'Senior PHP Developer',
        'address': { '@type': 'PostalAddress', 'addressLocality': 'Poznań', 'addressCountry': 'PL' }
      },
      'offers': {
        '@type': 'Offer',
        'priceSpecification': {
          '@type': 'PriceSpecification',
          'minPrice': service.value?.priceFrom,
          'priceCurrency': service.value?.priceCurrency ?? 'USD',
          ...(service.value?.priceUnit === 'hour' ? { unitText: 'HOUR' } : {})
        }
      }
    },
    {
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { name: t('nav.home'), item: `${origin}${localePath('/')}` },
        { name: t('nav.services'), item: `${origin}${localePath('/services')}` },
        ...(direction.value ? [{ name: direction.value.label, item: `${origin}${direction.value.path}` }] : []),
        { name: title, item: serviceUrl }
      ].map((crumb, index) => ({ '@type': 'ListItem', 'position': index + 1, ...crumb }))
    }
  ]
  if (service.value?.faq?.length) {
    graph.push({
      '@type': 'FAQPage',
      'mainEntity': service.value.faq.map(item => ({
        '@type': 'Question',
        'name': item.label,
        'acceptedAnswer': { '@type': 'Answer', 'text': item.content }
      }))
    })
  }
  return { '@context': 'https://schema.org', '@graph': graph }
})

useHead({
  script: [{
    type: 'application/ld+json',
    key: `service-ld-${slug.value}`,
    innerHTML: JSON.stringify(jsonLd.value)
  }]
})
</script>

<template>
  <UPage v-if="service">
    <UPageSection :ui="{ container: 'pt-20! sm:pt-24!' }">
      <UBreadcrumb
        :items="[
          { label: t('nav.services'), to: localePath('/services') },
          ...(direction ? [{ label: direction.label, to: direction.path }] : []),
          { label: title }
        ]"
        class="mb-6"
      />

      <UPageHero
        :title="title"
        :description="service.summary"
        :ui="{
          container: 'pt-0! pb-8 lg:pb-10',
          title: 'mx-0! text-left',
          description: 'mx-0! text-left',
          links: 'justify-start'
        }"
      >
        <template #headline>
          <span class="inline-flex items-center justify-center size-8 rounded-lg bg-elevated text-primary">
            <UIcon
              :name="service.icon"
              class="size-5"
            />
          </span>
        </template>
        <template #links>
          <div class="flex flex-wrap items-center gap-2">
            <UButton
              :to="global.meetingLink"
              :label="t('contact.discussProject')"
              icon="i-simple-icons-telegram"
              color="primary"
              target="_blank"
            />
            <UBadge
              color="primary"
              variant="subtle"
              size="lg"
              icon="i-lucide-tag"
              :label="t(servicePriceKey(service), { price: service.priceFrom })"
            />
            <UBadge
              color="neutral"
              variant="subtle"
              size="lg"
              icon="i-lucide-clock"
              :label="service.timeline"
            />
          </div>
        </template>
      </UPageHero>

      <div class="rounded-xl border border-default bg-elevated/30 p-6">
        <h2 class="text-xl font-semibold text-highlighted mb-4">
          {{ t('services.deliverables') }}
        </h2>
        <ul class="grid gap-3 sm:grid-cols-2">
          <li
            v-for="(item, index) in service.deliverables"
            :key="index"
            class="flex gap-2 text-default"
          >
            <UIcon
              name="i-lucide-check"
              class="size-5 shrink-0 text-primary mt-0.5"
            />
            <span>{{ item }}</span>
          </li>
        </ul>
      </div>

      <div class="service-content mt-10">
        <MDC
          v-if="service.content"
          :value="service.content"
        />
      </div>

      <div class="mt-12">
        <h2 class="text-2xl font-semibold text-highlighted mb-6">
          {{ t('services.process') }}
        </h2>
        <ol class="grid gap-4 sm:grid-cols-2">
          <li
            v-for="(step, index) in service.process"
            :key="index"
            class="rounded-xl border border-default p-5"
          >
            <span class="text-sm font-semibold text-primary">{{ String(index + 1).padStart(2, '0') }}</span>
            <h3 class="mt-1 font-semibold text-highlighted">
              {{ step.title }}
            </h3>
            <p class="mt-1 text-sm text-muted">
              {{ step.description }}
            </p>
          </li>
        </ol>
      </div>

      <div
        v-if="related?.projects.length"
        class="mt-12"
      >
        <h2 class="text-2xl font-semibold text-highlighted mb-4">
          {{ t('services.relatedProjects') }}
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NuxtLink
            v-for="project in related.projects"
            :key="project.stem"
            :to="localePath(`/projects/${lastSegment(project)}`)"
            class="group rounded-xl border border-default bg-elevated/30 overflow-hidden transition-colors hover:border-primary/50"
          >
            <NuxtImg
              v-if="project.image"
              :src="project.image"
              :alt="project.title"
              width="1512"
              height="806"
              loading="lazy"
              class="w-full h-40 object-cover"
            />
            <div class="p-4">
              <h3 class="font-semibold text-highlighted group-hover:text-primary transition-colors">
                {{ project.title }}
              </h3>
              <p class="mt-1 text-sm text-muted line-clamp-2">
                {{ project.description }}
              </p>
            </div>
          </NuxtLink>
        </div>
      </div>

      <div
        v-if="related?.technologies.length"
        class="mt-10"
      >
        <h2 class="text-xl font-semibold text-highlighted mb-4">
          {{ t('services.relatedTechnologies') }}
        </h2>
        <div class="flex flex-wrap gap-2">
          <UButton
            v-for="tech in related.technologies"
            :key="tech.stem"
            :to="localePath(`/technologies/${lastSegment(tech)}`)"
            :icon="tech.icon"
            :label="tech.title"
            color="neutral"
            variant="subtle"
          />
        </div>
      </div>

      <div
        v-if="service.faq?.length"
        class="mt-12"
      >
        <h2 class="text-2xl font-semibold text-highlighted mb-4">
          {{ t('services.faq') }}
        </h2>
        <UAccordion
          :items="service.faq"
          :ui="{ trigger: 'text-left' }"
        />
      </div>

      <UPageCTA
        class="mt-10"
        :title="t('services.ctaTitle')"
        :description="t('projectsCta.description')"
        :links="[
          { label: t('contact.telegram'), to: global.meetingLink, color: 'primary', icon: 'i-simple-icons-telegram', target: '_blank' },
          { label: t('contact.email'), to: `mailto:${global.email}`, color: 'neutral', icon: 'i-heroicons-envelope' }
        ]"
      />
    </UPageSection>
  </UPage>
</template>
