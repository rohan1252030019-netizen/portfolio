# Alex Mercer — Portfolio

A premium, award-winning-style personal portfolio built with Next.js 15, Framer Motion, and Canvas API.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS 3 + CSS Custom Properties |
| Animation | Framer Motion 11 |
| Smooth Scroll | Lenis |
| Canvas | HTML5 Canvas API (scroll image sequence) |
| Language | TypeScript |
| Fonts | Cormorant Garamond + DM Sans + DM Mono |

---

## Quick Start

```bash
# 1. Clone / unzip the project
cd portfolio

# 2. Install dependencies
npm install
# or
pnpm install

# 3. Run dev server
npm run dev

# 4. Open http://localhost:3000
```

---

## Project Structure

```
portfolio/
├── app/
│   ├── globals.css          # Global styles, CSS vars, animations
│   ├── layout.tsx           # Root layout + metadata
│   └── page.tsx             # Main page — orchestrates all sections
│
├── components/
│   ├── ui/
│   │   ├── AnimatedText.tsx     # Word/char split text reveals
│   │   ├── MagneticButton.tsx   # Cursor-attracted button
│   │   └── ParallaxLayer.tsx    # Scroll-driven parallax wrapper
│   │
│   ├── About.tsx            # Bio section + marquee
│   ├── CanvasSequence.tsx   # ★ Scroll-based canvas animation
│   ├── Cursor.tsx           # Custom dual-layer cursor
│   ├── Footer.tsx           # Contact + footer
│   ├── Hero.tsx             # Full-screen landing + parallax
│   ├── Loader.tsx           # Intro preloader (split curtain)
│   ├── Navigation.tsx       # Sticky nav + mobile menu
│   ├── Projects.tsx         # Grid + 3D tilt cards + modal
│   ├── ScrollProgress.tsx   # Top progress bar
│   └── SmoothScroll.tsx     # Lenis initialisation wrapper
│
├── hooks/
│   ├── useIntersection.ts   # IntersectionObserver hook
│   ├── useMousePosition.ts  # Mouse tracking hook
│   └── useScrollProgress.ts # Scroll progress hook
│
├── lib/
│   └── utils.ts             # cn(), lerp(), mapRange(), Framer variants
│
├── public/
│   └── images/              # Add your project screenshots here
│
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Canvas Scroll Sequence — How It Works

This is the centrepiece animation. Here's the full pipeline explained:

### 1. Scroll Container Strategy

```tsx
// The wrapper is very tall (400vh) so the user has a lot to scroll through
<div style={{ height: "400vh" }}>
  {/* Canvas is sticky — stays in view while parent scrolls */}
  <div style={{ position: "sticky", top: 0, height: "100vh" }}>
    <canvas ref={canvasRef} />
  </div>
</div>
```

The tall wrapper creates a "scroll budget." The canvas element is `position: sticky`,
which means it pins to the top of the viewport and stays there while the user scrolls
through the extra height. This is the fundamental technique behind Apple-style
scroll sequences.

### 2. Scroll → Frame Mapping

```ts
const onScroll = () => {
  const rect = wrapperRef.current.getBoundingClientRect();
  const sectionH  = wrapperRef.current.offsetHeight;
  const scrolled  = Math.max(0, -rect.top);        // px scrolled into section
  const scrollable = sectionH - window.innerHeight; // total scrollable distance

  // Normalise to 0 → 1
  const progress = Math.min(1, Math.max(0, scrolled / scrollable));

  // Map to frame index
  const frame = Math.floor(progress * (TOTAL_FRAMES - 1));
  currentFrameRef.current = frame;
};
```

### 3. Preloading Images

```ts
// In production, point to real frame sequences:
const urls = Array.from({ length: 60 }, (_, i) =>
  `/frames/frame_${String(i).padStart(3, "0")}.jpg`
);

const frames = urls.map(src => {
  const img = new Image();
  img.src = src;
  return img;
});
```

All frames are preloaded before playback begins. The `framesLoaded` state
tracks when all images have fired their `onload` event.

### 4. RequestAnimationFrame Loop

```ts
const loop = () => {
  const frame = currentFrameRef.current;

  // Only redraw if the frame has changed — avoids unnecessary GPU work
  if (frame !== lastFrame) {
    coverDraw(frames[frame]); // draw with "cover" scaling
    lastFrame = frame;
  }

  rafId = requestAnimationFrame(loop);
};
```

Using a `ref` (not state) for the current frame is critical — state updates
would trigger React re-renders and destroy performance. The RAF loop just
reads the ref value directly.

### 5. Cover Scaling

```ts
const coverDraw = (img: HTMLImageElement) => {
  const scale = Math.max(canvasW / img.naturalWidth, canvasH / img.naturalHeight);
  const dw = img.naturalWidth * scale;
  const dh = img.naturalHeight * scale;
  const dx = (canvasW - dw) / 2;
  const dy = (canvasH - dh) / 2;
  ctx.drawImage(img, dx, dy, dw, dh);
};
```

Mimics CSS `object-fit: cover` — fills the canvas without distortion.

### 6. DPI-Aware Canvas

```ts
const dpr = window.devicePixelRatio || 1;
canvas.width  = window.innerWidth * dpr;
canvas.height = window.innerHeight * dpr;
canvas.style.width  = window.innerWidth + "px";
canvas.style.height = window.innerHeight + "px";
ctx.scale(dpr, dpr);
```

Multiplying by `devicePixelRatio` ensures crisp rendering on Retina displays.

---

## Swapping in Real Image Sequences

To replace the procedural placeholder frames with real artwork:

1. Export your sequence as JPEGs: `frame_000.jpg` → `frame_059.jpg`
2. Place them in `/public/frames/`
3. In `CanvasSequence.tsx`, replace the `generateFrame()` call:

```ts
// Replace this:
const dataUrls = Array.from({ length: TOTAL_FRAMES }, (_, i) => generateFrame(i));

// With this:
const urls = Array.from({ length: TOTAL_FRAMES }, (_, i) =>
  `/frames/frame_${String(i).padStart(3, "0")}.jpg`
);
```

4. Adjust `TOTAL_FRAMES` to match your sequence length.

---

## Customisation Guide

### Change the name / persona

Edit `components/Hero.tsx` and `components/About.tsx` — the data is
inline for simplicity. In a production build, extract it to `lib/data.ts`.

### Add / remove projects

Edit the `PROJECTS` array in `components/Projects.tsx`.

### Change the colour scheme

All colours are CSS custom properties in `app/globals.css`:

```css
:root {
  --color-accent: #e8a44d;  /* change this to your brand colour */
  --color-bg: #080807;
  --color-text: #f5f0e8;
}
```

### Adjust parallax intensity

In `Hero.tsx`, tweak the `useTransform` ranges:

```ts
const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);
//                                                              ↑ decrease for subtler parallax
```

---

## Performance Notes

- **Canvas RAF guard**: only redraws when frame index changes
- **Ref-based frame tracking**: avoids React re-renders in the hot scroll path
- **Passive scroll listeners**: `{ passive: true }` on all scroll handlers
- **Lenis**: replaces browser smooth-scroll with a JS implementation that
  syncs with Framer Motion's `useScroll` hooks
- **Image preloading**: all canvas frames load before playback
- **will-change**: applied by Framer Motion automatically on animated elements
- **DPR scaling**: canvas renders at native pixel density

---

## Deployment

```bash
# Build
npm run build

# Deploy to Vercel (recommended)
npx vercel --prod

# Or export static (remove dynamic routes first)
npm run build && npm run export
```

---

## Credits & Inspiration

- Typography: Cormorant Garamond (display), DM Sans (body), DM Mono (mono)
- Smooth scroll: [Lenis by Studio Freight](https://github.com/darkroomengineering/lenis)
- Animation: [Framer Motion](https://www.framer.com/motion/)
- Inspired by: Basement Studio, Active Theory, Bruno Simon

---

Built with obsession. ✦
