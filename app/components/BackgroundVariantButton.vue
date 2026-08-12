<script setup lang="ts">
const bgVariant = useBackgroundVariant()

const nextVariant = computed(() => (bgVariant.value === '2' ? '1' : '2'))

const switchVariant = () => {
  bgVariant.value = nextVariant.value
}

const startViewTransition = (event: MouseEvent) => circleRevealTransition(event, switchVariant)
</script>

<template>
  <ClientOnly>
    <UButton
      aria-label="Switch background style"
      icon="i-lucide-palette"
      color="neutral"
      variant="ghost"
      size="sm"
      class="rounded-full"
      @click="startViewTransition"
    />
    <template #fallback>
      <div class="size-4" />
    </template>
  </ClientOnly>
</template>
