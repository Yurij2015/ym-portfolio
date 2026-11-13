<script setup lang="ts">
const props = defineProps<{
  direction: 'development' | 'support'
}>()

const { locale, t } = useI18n()
const localePath = useLocalePath()
const { global } = useAppConfig()

const { data: settings } = await useAsyncData(
  () => `service-settings-${locale.value}`,
  () => queryCollection(`service_settings_${locale.value}` as 'service_settings_uk').first(),
  { watch: [locale] }
)

const { data: services } = await useAsyncData(
  () => `services-${props.direction}-${locale.value}`,
  () => queryCollection(`services_${locale.value}` as 'services_uk')
    .where('group', '=', props.direction)
    .order('order', 'ASC')
    .all(),
  { watch: [locale] }
)

const page = computed(() => settings.value?.directions?.[props.direction])
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Service direction not found',
    fatal: true
  })
}

const title = page.value.title
const description = page.value.description

const robots = computed(() => page.value?.indexable === true ? 'index, follow' : 'noindex, follow')
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
const pagePath = computed(() => localePath(`/services/${props.direction}`))

const slugOf = (service: { stem?: string }) =>
  String(service.stem ?? '').split('/').pop() ?? ''

useHead({
  script: [{
    type: 'application/ld+json',
    key: `service-direction-ld-${props.direction}`,
    innerHTML: computed(() => JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'ItemList',
          'name': title,
          'itemListElement': (services.value ?? []).map((service, index) => ({
            '@type': 'ListItem',
            'position': index + 1,
            'name': service.title,
            'url': `${origin}${localePath(`/services/${slugOf(service)}`)}`
          }))
        },
        {
          '@type': 'BreadcrumbList',
          'itemListElement': [
            { '@type': 'ListItem', 'position': 1, 'name': t('nav.home'), 'item': `${origin}${localePath('/')}` },
            { '@type': 'ListItem', 'position': 2, 'name': t('nav.services'), 'item': `${origin}${localePath('/services')}` },
            { '@type': 'ListItem', 'position': 3, 'name': page.value?.label, 'item': `${origin}${pagePath.value}` }
          ]
        }
      ]
    }))
  }]
})
</script>

<template>
  <UPage v-if="page">
    <UPageSection :ui="{ container: 'pt-20! sm:pt-24!' }">
      <UBreadcrumb
        :items="[
          { label: t('nav.services'), to: localePath('/services') },
          { label: page.label }
        ]"
        class="mb-6"
      />

      <UPageHero
        :title="title"
        :description="page.intro"
        :ui="{
          container: 'pt-0! pb-10 lg:pb-12',
          title: 'mx-0! text-left',
          description: 'mx-0! text-left'
        }"
      />

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <ServiceCard
          v-for="service in services"
          :key="service.stem"
          :service="service"
        />
      </div>

      <UPageCTA
        class="mt-12"
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
