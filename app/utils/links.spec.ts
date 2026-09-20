import { defineComponent, h } from 'vue'
import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'

describe('useNavLinks', () => {
  it('returns 4 nav items pointing at home, projects, about and contact', async () => {
    const TestComponent = defineComponent({
      setup() {
        const links = useNavLinks()
        return () => h('pre', JSON.stringify(links.value))
      }
    })

    const wrapper = await mountSuspended(TestComponent)
    const items = JSON.parse(wrapper.text())

    expect(items).toHaveLength(4)
    expect(items.map((item: { icon: string }) => item.icon)).toEqual([
      'i-lucide-home',
      'i-lucide-folder',
      'i-lucide-user',
      'i-lucide-mail'
    ])
    expect(items.every((item: { label: string }) => typeof item.label === 'string' && item.label.length > 0)).toBe(true)
    expect(items.map((item: { to: string }) => item.to)).toEqual(['/', '/projects', '/about', '/#contact'])
  })
})
