<script setup lang="ts">
const { locale, t } = useI18n()
const route = useRoute()
const localePath = useLocalePath()
const { global } = useAppConfig()

const slug = computed(() => String(route.params.slug))

const { data: tech } = await useAsyncData(
  () => `technology-${locale.value}-${slug.value}`,
  () => queryCollection(`technologies_${locale.value}` as 'technologies_uk')
    .where('stem', '=', `${locale.value}/technologies/${slug.value}`)
    .first(),
  { watch: [locale, slug] }
)
if (!tech.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Technology not found',
    fatal: true
  })
}

const techSlug = (item: { stem?: string }) =>
  String(item.stem ?? '').split('/').pop() ?? ''

// Explicit slugs in YAML — resolved against the projects collection so
// a missing project reference degrades gracefully instead of 404ing.
const { data: techProjects } = await useAsyncData(
  () => `technology-projects-${locale.value}-${slug.value}`,
  async () => {
    const all = await queryCollection(`projects_${locale.value}` as 'projects_uk').all()
    return (tech.value?.projects ?? [])
      .map(s => all.find(p => p.stem?.endsWith(`/projects/${s}`)))
      .filter((p): p is NonNullable<typeof p> => Boolean(p))
  },
  { watch: [locale, slug] }
)

const title = tech.value.title
const description = tech.value.description

// "Projects built on X" fits languages/frameworks; databases, infra and
// tools read better as "Projects using X".
const usedInKey = ['backend', 'frontend'].includes(tech.value.category)
  ? 'technologies.usedIn'
  : 'technologies.usedWith'

const origin = (useRuntimeConfig().public.siteUrl as string) || useRequestURL().origin
const techUrl = `${origin}${route.path}`

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description,
  ogType: 'article'
})

defineOgImage('Technology', {
  title,
  description,
  icon: `/tech-og/${slug.value}.png`,
  headline: t('technologies.title')
}, { alt: title })

const jsonLd = computed(() => {
  const graph: Record<string, unknown>[] = [
    {
      '@type': 'Article',
      'headline': title,
      description,
      'inLanguage': locale.value,
      'author': {
        '@type': 'Person',
        'name': 'Yurii Mokryi',
        'url': origin
      },
      'about': {
        '@type': 'Thing',
        'name': title
      },
      'mainEntityOfPage': techUrl,
      ...(tech.value?.updated ? { dateModified: tech.value.updated } : {})
    },
    {
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': `${origin}${localePath('/')}` },
        { '@type': 'ListItem', 'position': 2, 'name': t('technologies.title'), 'item': `${origin}${localePath('/technologies')}` },
        { '@type': 'ListItem', 'position': 3, 'name': title, 'item': techUrl }
      ]
    }
  ]
  if (tech.value?.faq?.length) {
    graph.push({
      '@type': 'FAQPage',
      'mainEntity': tech.value.faq.map(item => ({
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
    key: `tech-ld-${slug.value}`,
    innerHTML: JSON.stringify(jsonLd.value)
  }]
})
</script>

<template>
  <UPage v-if="tech">
    <UPageSection :ui="{ container: 'pt-20! sm:pt-24!' }">
      <UButton
        :to="localePath('/technologies')"
        variant="ghost"
        color="neutral"
        icon="i-lucide-arrow-left"
        :label="t('technologies.back')"
        class="mb-6 -ml-2"
      />

      <UPageHero
        :title="title"
        :description="description"
        :ui="{
          container: 'pt-0! pb-10 lg:pb-12',
          title: 'mx-0! text-left',
          description: 'mx-0! text-left',
          links: 'justify-start'
        }"
      >
        <template #headline>
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center justify-center size-8 rounded-lg bg-elevated text-primary">
              <UIcon
                :name="tech.icon"
                class="size-5"
              />
            </span>
            <span
              v-if="tech.since"
              class="flex w-fit items-center gap-1.5 rounded-full bg-elevated/60 px-3 py-1 text-xs font-medium text-muted"
            >
              <UIcon
                name="i-lucide-calendar"
                class="size-3.5"
              />
              {{ t('technologies.since', { year: tech.since }) }}
            </span>
          </div>
        </template>
        <template #links>
          <div
            v-if="tech.links?.length"
            class="flex flex-wrap items-center gap-2"
          >
            <UButton
              v-for="(link, index) in tech.links"
              :key="index"
              v-bind="link"
            />
          </div>
        </template>
      </UPageHero>

      <NuxtImg
        :src="`/tech/${slug}.svg`"
        :alt="title"
        width="1200"
        height="480"
        class="w-full aspect-[5/2] object-cover rounded-xl"
      />

      <div class="mt-10">
        <MDC
          v-if="tech.content"
          :value="tech.content"
        />
      </div>

      <div
        v-if="techProjects?.length"
        class="mt-12"
      >
        <h2 class="text-2xl font-semibold text-highlighted mb-4">
          {{ t(usedInKey, { tech: title }) }}
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NuxtLink
            v-for="project in techProjects"
            :key="project.stem"
            :to="localePath(`/projects/${techSlug(project)}`)"
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
        v-if="tech.faq?.length"
        class="mt-12"
      >
        <h2 class="text-2xl font-semibold text-highlighted mb-4">
          {{ t('technologies.faq') }}
        </h2>
        <UAccordion
          :items="tech.faq"
          :ui="{ trigger: 'text-left' }"
        />
      </div>

      <UPageCTA
        class="mt-10"
        :title="t('technologies.ctaTitle', { tech: title })"
        :description="t('projectsCta.description')"
        :links="[
          { label: t('contact.telegram'), to: global.meetingLink, color: 'primary', icon: 'i-simple-icons-telegram', target: '_blank' },
          { label: t('contact.email'), to: `mailto:${global.email}`, color: 'neutral', icon: 'i-heroicons-envelope' }
        ]"
      />
    </UPageSection>
  </UPage>
</template>
