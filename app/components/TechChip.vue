<script setup lang="ts">
const props = defineProps<{
  name: string
  icon: string
  to?: string
}>()

const NuxtLink = resolveComponent('NuxtLink')
</script>

<template>
  <component
    :is="props.to ? NuxtLink : 'span'"
    :to="props.to"
    :title="props.name"
    class="inline-flex items-center justify-center rounded-md bg-elevated/60 text-dimmed transition-colors"
    :class="props.to ? 'hover:text-primary hover:bg-elevated' : ''"
  >
    <UIcon
      :name="props.icon"
      class="size-4"
    />
  </component>
</template>
