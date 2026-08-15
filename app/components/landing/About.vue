<script setup lang="ts">
import type { IndexPageItem } from '~/utils/content-types'

defineProps<{
  page: IndexPageItem
}>()
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
  />
</template>

<style scoped>

</style>
