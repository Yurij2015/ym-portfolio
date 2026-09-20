<script setup lang="ts">
const { locale, t } = useI18n()
const localePath = useLocalePath()
const { global } = useAppConfig()

const { data: technologies } = await useAsyncData(
  () => `technologies-${locale.value}`,
  () => queryCollection(`technologies_${locale.value}` as 'technologies_uk').all(),
  { watch: [locale] }
)

const techSlug = (tech: { stem?: string }) =>
  String(tech.stem ?? '').split('/').pop() ?? ''

const CATEGORIES = ['backend', 'frontend', 'database', 'infrastructure', 'tools'] as const

const grouped = computed(() =>
  CATEGORIES
    .map(category => ({
      key: category,
      items: (technologies.value ?? []).filter(tech => tech.category === category)
    }))
    .filter(group => group.items.length)
)

const title = t('technologies.title')
const description = t('technologies.description')

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description
})

defineOgImage('Portfolio', { title, description, headline: title }, { alt: title })
</script>

<template>
  <UPage>
    <UPageSection :ui="{ container: 'pt-20! sm:pt-24!' }">
      <UPageHero
        :title="title"
        :description="description"
        :ui="{
          container: 'pt-0! pb-10 lg:pb-12',
          title: 'mx-0! text-left',
          description: 'mx-0! text-left'
        }"
      />

      <div
        v-for="group in grouped"
        :key="group.key"
        class="mb-10"
      >
        <h2 class="text-xl font-semibold text-highlighted mb-4">
          {{ t(`technologies.categories.${group.key}`) }}
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <NuxtLink
            v-for="tech in group.items"
            :key="techSlug(tech)"
            :to="localePath(`/technologies/${techSlug(tech)}`)"
            class="group rounded-xl border border-default bg-elevated/30 overflow-hidden transition-colors hover:border-primary/50"
          >
            <NuxtImg
              :src="`/tech/${techSlug(tech)}.svg`"
              :alt="tech.title"
              width="1200"
              height="480"
              loading="lazy"
              class="w-full aspect-[5/2] object-cover"
            />
            <div class="flex items-start gap-3 p-4">
              <span class="inline-flex shrink-0 items-center justify-center size-9 rounded-lg bg-elevated text-primary">
                <UIcon
                  :name="tech.icon"
                  class="size-5"
                />
              </span>
              <div class="min-w-0">
                <h3 class="font-semibold text-highlighted group-hover:text-primary transition-colors">
                  {{ tech.title }}
                </h3>
                <p class="mt-1 text-sm text-muted line-clamp-2">
                  {{ tech.description }}
                </p>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>

      <UPageCTA
        class="mt-10"
        :title="t('projectsCta.title')"
        :description="t('projectsCta.description')"
        :links="[
          { label: t('contact.telegram'), to: global.meetingLink, color: 'primary', icon: 'i-simple-icons-telegram', target: '_blank' },
          { label: t('contact.email'), to: `mailto:${global.email}`, color: 'neutral', icon: 'i-heroicons-envelope' }
        ]"
      />
    </UPageSection>
  </UPage>
</template>
