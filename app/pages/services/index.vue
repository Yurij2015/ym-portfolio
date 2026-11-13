<script setup lang="ts">
const { locale, t } = useI18n()
const localePath = useLocalePath()
const { global } = useAppConfig()

const { data: services } = await useAsyncData(
  () => `services-${locale.value}`,
  () => queryCollection(`services_${locale.value}` as 'services_uk').order('order', 'ASC').all(),
  { watch: [locale] }
)

const { data: settings } = await useAsyncData(
  () => `service-settings-${locale.value}`,
  () => queryCollection(`service_settings_${locale.value}` as 'service_settings_uk').first(),
  { watch: [locale] }
)

const serviceSlug = (service: { stem?: string }) =>
  String(service.stem ?? '').split('/').pop() ?? ''

const DIRECTIONS = ['development', 'support'] as const

// Featured slugs are curated in services.yml; a stale slug is skipped
// instead of breaking the page.
const directions = computed(() =>
  DIRECTIONS.flatMap((key) => {
    const direction = settings.value?.directions?.[key]
    if (!direction) return []
    const all = (services.value ?? []).filter(service => service.group === key)
    return [{
      key,
      ...direction,
      total: all.length,
      items: direction.featured
        .map(slug => all.find(service => serviceSlug(service) === slug))
        .filter((service): service is NonNullable<typeof service> => Boolean(service))
    }]
  })
)

const title = settings.value?.title ?? t('nav.services')
const description = settings.value?.description ?? ''

const robots = computed(() => settings.value?.indexable === true ? 'index, follow' : 'noindex, follow')
useResponseHeader('X-Robots-Tag').value = robots.value

useSeoMeta({
  robots: () => robots.value,
  title,
  ogTitle: title,
  description,
  ogDescription: description
})

defineOgImage('Portfolio', { title, description, headline: t('nav.services') }, { alt: title })

const origin = (useRuntimeConfig().public.siteUrl as string) || useRequestURL().origin

useHead({
  script: [{
    type: 'application/ld+json',
    key: 'services-ld',
    innerHTML: computed(() => JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'ItemList',
          'name': title,
          'itemListElement': directions.value.map((direction, index) => ({
            '@type': 'ListItem',
            'position': index + 1,
            'name': direction.title,
            'url': `${origin}${localePath(`/services/${direction.key}`)}`
          }))
        },
        {
          '@type': 'BreadcrumbList',
          'itemListElement': [
            { '@type': 'ListItem', 'position': 1, 'name': t('nav.home'), 'item': `${origin}${localePath('/')}` },
            { '@type': 'ListItem', 'position': 2, 'name': t('nav.services'), 'item': `${origin}${localePath('/services')}` }
          ]
        }
      ]
    }))
  }]
})
</script>

<template>
  <UPage>
    <UPageSection :ui="{ container: 'pt-20! sm:pt-24!' }">
      <UPageHero
        :title="title"
        :description="settings?.intro"
        :ui="{
          container: 'pt-0! pb-10 lg:pb-12',
          title: 'mx-0! text-left',
          description: 'mx-0! text-left'
        }"
      />

      <section
        v-for="direction in directions"
        :key="direction.key"
        class="mb-14"
      >
        <h2 class="text-2xl font-semibold text-highlighted">
          <NuxtLink
            :to="localePath(`/services/${direction.key}`)"
            class="hover:text-primary transition-colors"
          >
            {{ direction.title }}
          </NuxtLink>
        </h2>
        <p class="mt-3 max-w-3xl text-muted">
          {{ direction.intro }}
        </p>

        <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ServiceCard
            v-for="service in direction.items"
            :key="service.stem"
            :service="service"
          />
        </div>

        <UButton
          :to="localePath(`/services/${direction.key}`)"
          :label="t('services.allInDirection', { label: direction.label, count: direction.total })"
          trailing-icon="i-lucide-arrow-right"
          color="neutral"
          variant="subtle"
          class="mt-6"
        />
      </section>

      <UPageCTA
        :title="t('services.ctaIndexTitle')"
        :description="t('projectsCta.description')"
        :links="[
          { label: t('contact.telegram'), to: global.meetingLink, color: 'primary', icon: 'i-simple-icons-telegram', target: '_blank' },
          { label: t('contact.email'), to: `mailto:${global.email}`, color: 'neutral', icon: 'i-heroicons-envelope' }
        ]"
      />
    </UPageSection>
  </UPage>
</template>
