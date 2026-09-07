# magrizzly.github.io

Personal website and developer hub hosted publicly on GitHub Pages.

**Live URL**: [https://magrizzly.github.io](https://magrizzly.github.io)

## Highlights

- **Privacy-First**: Zero external tracking, zero analytics scripts, zero cookies.
- **Zero-Dependency Architecture**: Built with modern semantic HTML5, responsive CSS3 (with Dark and Light mode), and vanilla JavaScript.
- **Client-Side Utilities**: In-browser JSON formatter & validator, Base64/URL encoder, cryptographic hashing (SubtleCrypto), and local auto-saving scratchpad.
- **Instant Deployment**: No compilation or build runner required. Pushing to `main` deploys directly to GitHub Pages.

## Directory Structure

```
magrizzly.github.io/
├── index.html              # Homepage with hero & interactive bento grid
├── projects.html           # Project showcase with dynamic search & tag filters
├── tools.html              # Client-side developer utilities
├── notes.html              # Technical notes & cheatsheets
├── resources.html          # Curated developer bookmarks & references
├── about.html              # Technical stack & developer principles
├── 404.html                # Custom 404 error page
├── css/
│   ├── style.css           # Global design tokens, themes, typography, and reset
│   └── components.css      # Reusable UI components & layouts
├── js/
│   ├── main.js             # Theme switcher & mobile navigation
│   ├── tools.js            # Client-side utilities logic
│   └── search.js           # Client-side filtering & search engine
└── assets/
    └── favicon.svg         # Modern vector favicon & brand mark
```

## Local Development & Preview

To preview the website locally, run any static file server:

### Python 3
```bash
python -m http.server 8000
```
Then visit `http://localhost:8000`.

### Node.js (npx)
```bash
npx serve .
```

## License

MIT License. Open for customization and use.
