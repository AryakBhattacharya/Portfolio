# AI Portfolio Website

A modern, tech-aesthetic portfolio site built for AI/ML graduates. Dark theme, animated grid background, glassmorphism cards, and fully responsive — no build step required.

## Quick Start

Open `index.html` in your browser, or serve locally:

```bash
# Python
python -m http.server 8080

# Then visit http://localhost:8080
```

## Customize Your Portfolio

Replace placeholder content in these files:

| What | Where |
|------|-------|
| Name, title, bio | `index.html` — hero & about sections |
| Skills & tools | `index.html` — `#skills` section |
| Projects | `index.html` — `#projects` section |
| Education | `index.html` — `#education` section |
| Contact links | `index.html` — `#contact` section |
| Form email | `js/main.js` — `mailto:` link |
| Typing roles | `js/main.js` — `roles` array |
| Colors & fonts | `css/styles.css` — `:root` variables |

### Logo initials

Update the nav logo in `index.html`:

```html
<span class="logo-bracket">&lt;</span>YN<span class="logo-bracket">/&gt;</span>
```

Change `YN` to your initials.

### Resume

Add your CV as `assets/resume.pdf` and update the resume link:

```html
<a href="assets/resume.pdf" class="contact-card glass-card" download>
```

## Deploy

This is static HTML — deploy anywhere:

- **GitHub Pages** — push to a repo, enable Pages on `main`
- **Netlify** — drag & drop the folder
- **Vercel** — import the repo, no build command needed

## Structure

```
Portfolio/
├── index.html      # Main page
├── css/
│   └── styles.css  # All styles
├── js/
│   └── main.js     # Animations & interactions
└── README.md
```

## Features

- Animated dot grid that reacts to mouse movement
- Typing effect for role titles
- Scroll-reveal animations
- Neural network SVG hero visual
- Syntax-highlighted code block
- Mobile-responsive navigation
- Contact form (opens email client)
