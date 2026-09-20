import { describe, expect, it } from 'vitest'
import { techSlugForName, techSlugFromImage } from './technologies'

describe('techSlugFromImage', () => {
  it('extracts the slug from a hero tech image path', () => {
    expect(techSlugFromImage('/hero/tech-laravel.svg')).toBe('laravel')
    expect(techSlugFromImage('/hero/tech-github-actions.svg')).toBe('github-actions')
  })

  it('works with absolute-looking and bare paths', () => {
    expect(techSlugFromImage('tech-php.svg')).toBe('php')
  })
})

describe('techSlugForName', () => {
  it('maps plain names to slugs', () => {
    expect(techSlugForName('Laravel')).toBe('laravel')
    expect(techSlugForName('PostgreSQL')).toBe('postgresql')
    expect(techSlugForName('Docker')).toBe('docker')
  })

  it('resolves aliases', () => {
    expect(techSlugForName('Vue.js')).toBe('vue')
    expect(techSlugForName('Tailwind CSS')).toBe('tailwindcss')
    expect(techSlugForName('Laravel API')).toBe('laravel')
    expect(techSlugForName('GitHub Actions')).toBe('github-actions')
  })

  it('keeps unknown names deterministic', () => {
    expect(techSlugForName('GraphQL')).toBe('graphql')
    expect(techSlugForName('AI')).toBe('ai')
  })
})
