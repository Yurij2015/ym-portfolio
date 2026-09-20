#!/usr/bin/env node
// Generates public/tech/<slug>.svg article banners and public/tech-og/<slug>.png
// tiles (the OG renderer can't rasterize SVG <img> sources) from the existing
// /hero/tech-<slug>.svg logo tiles. Re-run when technologies change:
//   node scripts/generate-tech-banners.mjs
import { readdirSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import sharp from 'sharp'

const SRC = new URL('../public/hero/', import.meta.url).pathname
const OUT = new URL('../public/tech/', import.meta.url).pathname
const OUT_OG = new URL('../public/tech-og/', import.meta.url).pathname

mkdirSync(OUT, { recursive: true })
mkdirSync(OUT_OG, { recursive: true })

const tiles = readdirSync(SRC).filter(f => /^tech-.*\.svg$/.test(f))

for (const file of tiles) {
  const slug = file.replace(/^tech-/, '').replace(/\.svg$/, '')
  const svg = readFileSync(join(SRC, file), 'utf8')

  // Brand accent = the tile's background rect color; near-black accents
  // (e.g. Symfony) are invisible on the dark banner, so fall back to white
  const rawAccent = svg.match(/<rect[^>]*fill="(#[0-9A-Fa-f]{3,8})"/)?.[1] ?? '#3b82f6'
  const accent = rawAccent.toLowerCase() === '#000000' ? '#e5e5e5' : rawAccent
  const inner = svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')
  const viewBox = svg.match(/viewBox="([^"]+)"/)?.[1] ?? '0 0 468 468'

  const banner = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="480" viewBox="0 0 1200 480">
  <defs>
    <radialGradient id="a" cx="85%" cy="20%" r="70%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="b" cx="10%" cy="100%" r="70%">
      <stop offset="0%" stop-color="#1d4ed8" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#1d4ed8" stop-opacity="0"/>
    </radialGradient>
    <pattern id="g" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M40 0H0v40" fill="none" stroke="#ffffff" stroke-opacity="0.04"/>
    </pattern>
  </defs>
  <rect width="1200" height="480" fill="#0a0a0a"/>
  <rect width="1200" height="480" fill="url(#g)"/>
  <rect width="1200" height="480" fill="url(#a)"/>
  <rect width="1200" height="480" fill="url(#b)"/>
  <rect width="6" height="480" fill="${accent}"/>
  <g transform="translate(980 240) rotate(-8)">
    <svg x="-170" y="-170" width="340" height="340" viewBox="${viewBox}">${inner}</svg>
  </g>
  <g transform="translate(80 90)" opacity="0.12">
    <svg width="120" height="120" viewBox="${viewBox}">${inner}</svg>
  </g>
</svg>
`
  writeFileSync(join(OUT, `${slug}.svg`), banner)

  // PNG tile for OG images — takumi rasterizes raster sources only
  await sharp(join(SRC, file), { density: 300 })
    .resize(160, 160)
    .png()
    .toFile(join(OUT_OG, `${slug}.png`))

  console.log(`${slug}  accent=${accent}`)
}
console.log(`\n${tiles.length} banners → public/tech/`)
