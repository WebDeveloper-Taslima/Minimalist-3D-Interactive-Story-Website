# Convalt Energy — Minimalist 3D Interactive Story Website

> **Client Reference**: Convalt Energy (DigiCollect Corporation SOW Draft v1.0)  
> **Benchmark Style**: [mont-fort.com](https://mont-fort.com/)  
> **Tech Stack**: Three.js (r128), GSAP (3.12), Web Audio API, Vanilla ES Modules, Responsive Glassmorphism CSS.

---

## 1. Project Overview

This project turns Convalt Energy's written business scope into a live, browser-based 3D WebGL interactive narrative. Designed with generous negative space, neutral color palettes (`#0A0D12` / `#F7F6F2`), serene ambient audio synthesis, and smooth scroll-driven camera movements, the site delivers a calming experience optimized for 60 FPS performance on desktop and mobile devices.

---

## 2. GitHub Pages Deployment Guide (Step-by-Step)

This codebase is 100% ready for instant deployment on **GitHub Pages**, **Vercel**, **Netlify**, or **Cloudflare Pages** without needing any build tools or configuration!

### How to Publish on GitHub Pages:
1. **Create a Repository on GitHub**:
   Go to [github.com/new](https://github.com/new) and create a repository (e.g. `convalt-3d-story`).

2. **Push Workspace Code to GitHub**:
   Run the following commands in your terminal:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Convalt 3D Interactive Website"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/convalt-3d-story.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**:
   - On GitHub, navigate to your repository's **Settings** tab.
   - On the left sidebar, click **Pages**.
   - Under **Build and deployment** -> **Branch**, select `main` and branch folder `/ (root)`.
   - Click **Save**.

4. **View Live Hosted Website**:
   In ~60 seconds, GitHub Pages will give you your live URL:  
   `https://YOUR-USERNAME.github.io/convalt-3d-story/index.html`

   *This live URL will render the exact same 3D experience and animations as `http://localhost:8080/index.html`!*

---

## 3. Directory & Asset Map

```
Minimalist 3D Interactive Story Website/
├── .nojekyll                   # Disables Jekyll processing on GitHub Pages
├── index.html                  # 3D Landing Page & Interactive Chapter Engine
├── projects.html               # 2D Projects Showcase with Filter Tabs & Modals
├── project-detail.html         # 2D Deep Dive Case Study Page
├── team.html                   # 2D Leadership & Engineering Team Page
├── media.html                  # 2D Media Center, Press Releases & Download Kit
├── resources.html              # 2D ESG Reports & Carbon Offset Calculator
├── contact.html                # 2D Contact Form & Global Office Locations
├── README.md                   # Technical Documentation & GitHub Deployment Guide
├── css/
│   ├── main.css                # Base design system, color variables, typography & grid
│   ├── webgl.css               # Fullscreen WebGL canvas, HUD overlays & scroll hints
│   └── components.css          # Navigation header, glassmorphism cards, modals & footer
├── js/
│   ├── main.js                 # Application initializer & 60 FPS loop
│   ├── vendor/
│   │   ├── three.min.js        # Three.js Core Library (bundled locally)
│   │   └── gsap.min.js         # GSAP Animation Engine (bundled locally)
│   ├── 3d/
│   │   ├── SceneManager.js     # Three.js Renderer, PerspectiveCamera, Sun/Ambient Lights
│   │   ├── ChapterManager.js   # Scroll ratio mapping, camera lerp interpolation & cross-fades
│   │   ├── SubpageHeroCanvas.js# Subpage hero canvas background particle engine
│   │   ├── SolarFactoryScene.js# Chapter 1: 3D Silicon ingot, wafers & laser assembly
│   │   ├── PowerGridScene.js   # Chapter 2: 3D Solar tracker field & energy rays
│   │   ├── DataCenterScene.js  # Chapter 3: 3D Green server towers & fiber paths
│   │   ├── RecyclingScene.js   # Chapter 4: 3D Mobius loop & floating panel fragments
│   │   └── FallbackScene.js    # Canvas 2D fallback renderer for low-power devices
│   └── ui/
│       ├── AudioSynthesizer.js # Web Audio API ambient sound drone
│       ├── Navigation.js       # Header navigation, theme toggle (Dark/Light) & mobile menu
│       └── StoryUI.js          # Chapter HUD tracking, content cards & inspect modals
└── assets/
    └── images/                 # High-resolution optimized web imagery & brand assets
```

---

## 4. Key Engine Modules & Architecture

### `SceneManager.js`
Sets up the `THREE.WebGLRenderer`, `THREE.PerspectiveCamera`, directional sun lighting (`#FFF4E0`), cyan fill light, and ambient particle clouds. Implements interactive mouse parallax tracking.

### `ChapterManager.js`
Maps `window.scrollY` to a normalized `scrollProgress` between `0.0` and `1.0`. Interpolates camera position and look-at targets between defined chapter keyframes and blends chapter opacities for seamless scene transitions.

### `SubpageHeroCanvas.js`
Renders an active interactive geometric node canvas behind the hero header on all 2D sub-pages (`projects.html`, `project-detail.html`, `team.html`, `media.html`, `resources.html`, `contact.html`).

---

## 5. Local Running Instructions

Run a local HTTP web server using Python:

```bash
# Start local server on port 8080
python -m http.server 8080
```

Then open your browser to `http://localhost:8080/index.html`.
