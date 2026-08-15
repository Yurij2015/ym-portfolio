<script setup lang="ts">
import type { IndexPageItem } from '~/utils/content-types'

defineProps<{
  page: IndexPageItem
}>()
</script>

<template>
  <UPageSection
    :title="page.experience.title"
    :ui="{
      container: 'p-0! gap-4 sm:gap-4',
      title: 'text-left text-xl sm:text-xl lg:text-2xl font-medium',
      description: 'mt-2'
    }"
  >
    <template #description>
      <div class="flex flex-col gap-2">
        <Motion
          v-for="(experience, index) in page.experience.items"
          :key="index"
          :initial="{ opacity: 0, transform: 'translateY(20px)' }"
          :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
          :transition="{ delay: 0.4 + 0.2 * index }"
          :in-view-options="{ once: true }"
          class="text-muted flex flex-wrap items-center gap-x-2 gap-y-1"
        >
          <p class="text-sm shrink-0">
            {{ experience.date }}
          </p>
          <USeparator class="hidden sm:block w-4" />
          <ULink
            v-if="experience.company.url"
            class="flex flex-wrap items-center gap-1"
            :to="experience.company.url"
            target="_blank"
          >
            <span class="text-sm">
              {{ experience.position }}
            </span>
            <div
              class="inline-flex items-center gap-1"
              :style="{ color: experience.company.color }"
            >
              <span class="font-medium">{{ experience.company.name }}</span>
              <UIcon :name="experience.company.logo" />
            </div>
          </ULink>
          <span
            v-else
            class="flex flex-wrap items-center gap-1"
          >
            <span class="text-sm">
              {{ experience.position }}
            </span>
            <div
              class="inline-flex items-center gap-1"
              :style="{ color: experience.company.color }"
            >
              <span class="font-medium">{{ experience.company.name }}</span>
              <UIcon :name="experience.company.logo" />
            </div>
          </span>
          <p
            v-if="experience.description"
            class="w-full text-xs text-muted/80"
          >
            {{ experience.description }}
          </p>
        </Motion>
      </div>
    </template>
  </UPageSection>
</template>

<style scoped>

</style>
