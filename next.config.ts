import type { NextConfig } from 'next'

const config: NextConfig = {
  // The screenshots are the page. Served as-is from /public rather than through
  // the image optimiser: they are already 2x PNGs sized for their slot, and
  // re-encoding a halftone portrait is exactly how the dithering turns to mush.
  images: { unoptimized: true }
}

export default config
