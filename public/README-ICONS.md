# PWA Icons Setup

## Required Icons

You need to create the following icons for the PWA to work properly:

1. `icon-192x192.png` (192x192px)
2. `icon-512x512.png` (512x512px)
3. `icon-192x192-maskable.png` (192x192px with safe zone)
4. `icon-512x512-maskable.png` (512x512px with safe zone)

## Quick Setup

### Option 1: Use PWA Asset Generator (Recommended)

```bash
# Install the tool
npm install -g pwa-asset-generator

# Generate all icons from the placeholder SVG
pwa-asset-generator public/icon-placeholder.svg public --icon-only --favicon
```

### Option 2: Use Online Tool

1. Go to [RealFaviconGenerator](https://realfavicongenerator.net/)
2. Upload your logo/icon
3. Download the generated package
4. Copy the PNG files to the `public/` directory

### Option 3: Manual Creation

Use design software (Figma, Photoshop, etc.) to create:

- **Standard icons**: Icon on transparent or solid background
- **Maskable icons**: Icon with 20% padding (safe zone) on all sides

## Maskable Icons

Maskable icons ensure your icon looks good on all devices, even when shaped as a circle, squircle, or other shapes.

**Safe Zone Rules:**
- Icon content should be in the center 80% of the canvas
- 10% padding on all sides
- Background should extend to edges

## Testing Icons

1. Run the dev server: `npm run dev`
2. Open Chrome DevTools → Application → Manifest
3. Check that all icons load correctly
4. Test "Add to Home Screen" on mobile

## Current Status

A placeholder SVG icon (`icon-placeholder.svg`) is provided. Convert it to PNG or replace with your custom design.

