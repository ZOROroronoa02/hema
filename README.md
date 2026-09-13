# ♡ Happy Birthday, Hema

> A little corner of the internet — handmade with love, in a single HTML file.

A dreamy, cinematic, scroll-driven birthday surprise. Dark-luxe romantic aesthetic with aurora glows,
falling rose petals, twinkling stars, a sealed-envelope intro, a poem, polaroid memories,
reasons-i-love-you cards, a wish-to-the-stars box, and a blow-out-the-candles finale with confetti.

**Just open `hema-birthday.html` in any browser. That's it. No build step. No dependencies to install.**

---

## ✨ Preview

| Moment | What happens |
|---|---|
| 💌 **The Seal** | A "tap to open" envelope gate — builds anticipation before the reveal |
| 🌌 **Hero** | Hand-drawn heart, shimmering *Birthday* gradient, aurora orbs + petals |
| 📜 **Poem** | 10 lines revealed line-by-line on scroll inside a frosted-glass card |
| 📸 **Memories** | 4 tilted polaroids with washi-tape, hover lift, tap-to-enlarge lightbox |
| 💗 **Reasons** | 5 numbered editorial cards — swap in your inside jokes |
| 🌠 **Wish box** | She types a wish → it floats up to the stars + mini confetti |
| 🎂 **Finale** | 3 flickering flames — tap each to blow it out → confetti explosion |
| 🎵 **Music** | "Play song" button synthesizes *Happy Birthday* live via WebAudio (no audio file needed) |

---

## 🚀 Quick start

```bash
# 1. Clone / download this folder
# 2. Just open it:
open hema-birthday.html        # macOS
start hema-birthday.html       # Windows
xdg-open hema-birthday.html    # Linux
```

Or send it to her:

- **Easiest:** WhatsApp / Telegram the file itself — it opens in her mobile browser.
- **Fancy:** host it free in 30 seconds with any of these:
  - Drag the file into [netlify.com/drop](https://app.netlify.com/drop)
  - Or `npx vercel` / GitHub Pages / Tiiny.host
  - Then send her the link like `https://happy-birthday-hema.netlify.app`

---

## 🖼️ Add her real photos (2 minutes)

By default the gallery shows pretty placeholders so the page looks good instantly.
To make her cry (the good way), replace them:

```
hema/
├── hema-birthday.html
└── images/
    ├── 1.jpg
    ├── 2.jpg
    ├── 3.jpg
    └── 4.jpg
```

1. Create a folder called `images` next to `hema-birthday.html`
2. Drop in 4 photos named exactly `1.jpg`, `2.jpg`, `3.jpg`, `4.jpg`
3. Done — the page picks them up automatically (with graceful fallback if one is missing)

> Tip: square-ish / 4:5 portrait crops look best in the polaroid frames.

---

## ✏️ Make it yours

Everything lives in **one file** — open `hema-birthday.html` in any editor and search for these:

| To change… | Search for… |
|---|---|
| Her name everywhere | `Hema` |
| Poem lines | `class="line"` |
| Reasons list | `class="reason"` |
| Birthday wish text | `wish-big` |
| Final message | `wish made` |
| Colours (rose / gold / night) | `:root` → `--rose`, `--gold`, `--bg` |

Fonts used (via Google Fonts, no install needed): **Playfair Display** (display serif) · **Caveat** (handwriting) · **Jost** (body).

---

## 🛠️ Tech stack

- **Zero build** — pure HTML + CSS + JS in one file (~600 lines)
- [GSAP 3 + ScrollTrigger](https://gsap.com/) via CDN — scroll reveals, heart line-draw
- [canvas-confetti](https://github.com/catdad/canvas-confetti) via CDN — finale explosions
- `<canvas>` starfield + falling-petal engine (vanilla JS, ~40 lines)
- WebAudio API — synthesized Happy Birthday melody, no `.mp3` required
- Fully responsive, `prefers-reduced-motion` respected 📱♿

---

## 📁 Structure

```
hema/
├── hema-birthday.html   ← the whole surprise (open this!)
├── images/              ← optional: 1.jpg … 4.jpg (her real photos)
└── README.md            ← you are here
```

---

## 💡 Ideas to level it up further

- [ ] Record a 10-second voice note, drop it as `voice.mp3`, add an `<audio>` button
- [ ] Change the date-gate: only unlocks on her actual birthday
- [ ] Add a hidden 6th reason that appears after all candles are blown
- [ ] QR-code the hosted link onto a physical birthday card

---

<p align="center">
  <i>“Not older, love — just more of you.<br>More warm, more wild, more wholly true.”</i>
  <br><br>
  handmade with ♥ for Hema · 2026
</p>
