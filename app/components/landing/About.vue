<script setup lang="ts">
import type { IndexPageItem } from '~/utils/content-types'

const { t } = useI18n()

defineProps<{
  page: IndexPageItem
}>()

const factKeys = ['years', 'saas', 'ticketing', 'reply'] as const
</script>

<template>
  <UPageSection
    :title="page.about.title"
    :description="page.about.description"
    :ui="{
      container: 'p-0!',
      title: 'text-left text-xl sm:text-xl lg:text-2xl font-medium',
      description: 'text-left mt-3 text-sm sm:text-md text-muted leading-relaxed'
    }"
  >
    <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div
        v-for="key in factKeys"
        :key="key"
        class="rounded-lg bg-elevated/60 p-3 text-sm text-muted"
      >
        {{ t(`facts.${key}`) }}
      </div>
    </div>
  </UPageSection>
</template>
