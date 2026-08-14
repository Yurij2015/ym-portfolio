<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

defineProps<{
  links: NavigationMenuItem[]
}>()
</script>

<template>
  <div class="fixed top-2 sm:top-4 inset-x-0 mx-auto z-10 w-fit max-w-[calc(100vw-1rem)]">
    <UNavigationMenu
      :items="links"
      variant="link"
      color="neutral"
      class="bg-muted/80 backdrop-blur-sm rounded-full px-2 sm:px-4 border border-muted/50 shadow-lg shadow-neutral-950/5 overflow-x-auto flex-nowrap"
      :ui="{
        list: 'flex-nowrap',
        link: 'px-1.5 sm:px-2 py-1 shrink-0',
        linkLeadingIcon: 'hidden'
      }"
    >
      <template #list-trailing>
        <div class="flex items-center gap-1">
          <LanguageSwitcher />
          <BackgroundVariantButton />
          <ColorModeButton />
        </div>
      </template>
    </UNavigationMenu>
  </div>
</template>
