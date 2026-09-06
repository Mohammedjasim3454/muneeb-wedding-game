# THE GROOM'S ADVENTURE 💍

A luxury, mobile-first web invitation and 2D side-scrolling runner game created for a wedding surprise!

---

## 🌟 Features

- **Mobile Phone First**: Optimized touch controls (tap anywhere to jump), responsive canvas scaling, and zero horizontal scroll.
- **Cinematic Experience Flow**:
  1. **Welcome Screen**: Hero groom photo, romantic typography, and audio controls.
  2. **Memory Scroll**: Vertical timeline of photos with scroll-triggered animations.
  3. **Game Intro**: Instructions & Start Game trigger.
  4. **Canvas 2D Endless Runner**: Parallax sunset environment, obstacle dodging, and heart/ring collecting.
  5. **Final Level & Wedding Stage**: Reaching the target score brings the groom to the wedding altar with the bride, accompanied by confetti and victory fanfare.
  6. **Wedding Details Modal**: Instant access to groom, bride, date, time, venue, and location details.
- **Web Audio API Sound Engine**: Synthesized sound effects (jump, collect heart, collect ring, crash, victory) built-in out-of-the-box without requiring external audio files.

---

## 🛠️ How to Customize

All customization parameters are stored at the top of `game.js`:

```javascript
const WEDDING_CONFIG = {
    groomName: "MUNEE",
    brideName: "BRIDE",
    weddingDate: "OCTOBER 24, 2026",
    weddingVenue: "THE GRAND PALACE HALL",
    weddingTime: "5:00 PM",
    weddingLocation: "MAIN STREET, CITY CENTER",
    targetScore: 200 // Score required to trigger the wedding win stage
};
```

### Replacing Photos
Place your photos in the `assets/` folder with relative paths:
- `assets/photo1.jpg` – Memory 1
- `assets/photo2.jpg` – Memory 2
- `assets/photo3.jpg` – Memory 3
- `assets/photo4.jpg` – Memory 4
- `assets/photo5.jpg` – Memory 5
- `assets/groom.jpg` – Groom avatar photo used on hero card and in game avatar frame

---

## 🚀 How to Deploy on GitHub Pages

1. Create a repository on GitHub (e.g., `grooms-adventure`).
2. Push all project files (`index.html`, `style.css`, `game.js`, `assets/`, `README.md`).
3. Go to **Repository Settings** -> **Pages**.
4. Set source branch to **`main`** / **`root`**.
5. Save! GitHub Pages will generate your site URL (e.g. `https://yourusername.github.io/grooms-adventure/`).
6. Convert this URL into a QR code and print it on physical wedding invitation cards!
