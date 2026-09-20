<script setup lang="ts">
import type { DropdownMenuItem, NavigationMenuItem } from '@nuxt/ui'

const props = defineProps<{
  links: NavigationMenuItem[]
}>()

const menuLinks = computed<DropdownMenuItem[]>(() =>
  props.links.map(link => ({
    label: link.label,
    icon: link.icon,
    to: link.to
  }))
)
</script>

<template>
  <div class="fixed top-2 sm:top-4 inset-x-0 mx-auto z-10 w-fit max-w-[calc(100vw-1rem)]">
    <UNavigationMenu
      :items="links"
      variant="link"
      color="neutral"
      class="max-sm:hidden bg-muted/80 backdrop-blur-sm rounded-full px-2 sm:px-4 border border-muted/50 shadow-lg shadow-neutral-950/5"
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

    <!-- On phones the pill can't fit 4 links + 3 controls — collapse the
         links into a menu so nothing scrolls or clips. -->
    <div class="sm:hidden flex items-center gap-1 bg-muted/80 backdrop-blur-sm rounded-full px-2 py-1 border border-muted/50 shadow-lg shadow-neutral-950/5">
      <UDropdownMenu
        :items="menuLinks"
        :ui="{ content: 'w-48' }"
      >
        <UButton
          icon="i-heroicons-bars-3"
          color="neutral"
          variant="ghost"
          size="sm"
          aria-label="Menu"
        />
      </UDropdownMenu>
      <LanguageSwitcher />
      <BackgroundVariantButton />
      <ColorModeButton />
    </div>
  </div>
</template>
