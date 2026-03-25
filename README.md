# Personal GitHub Pages site starter

This is a lightweight static website that works well on GitHub Pages and is easy to edit in VS Code, Codex, or directly on GitHub.

## Files

- `index.html` — main page
- `style.css` — styling
- `script.js` — loads publication cards from JSON
- `data/publications.json` — easiest place to update recent publications

## Fastest way to publish on GitHub Pages

1. Create a new GitHub repository named:
   `YOUR-USERNAME.github.io`
2. Upload all files from this folder to the repository root.
3. Commit and push.
4. In GitHub, go to:
   `Settings` → `Pages`
5. Under **Build and deployment**:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/(root)`
6. Save and wait for the site to publish.
7. Your site should appear at:
   `https://YOUR-USERNAME.github.io`

## First edits to make

### 1. Replace the email address
In `index.html`, replace:
`your.email@kuleuven.be`

### 2. Add your photo
Replace the `div` with class `portrait-placeholder` in `index.html` with an `img` tag, for example:

```html
<img class="portrait-placeholder" src="assets/enis.jpg" alt="Portrait of Mumin Enis Leblebici" />
```

Then place `enis.jpg` inside the `assets` folder.

### 3. Update publications
Edit `data/publications.json`.
Each publication entry has:
- `year`
- `venue`
- `title`
- `summary`
- `paperUrl`
- `doiUrl`

## Recommended workflow with Codex

A good first prompt inside Codex would be:

> Improve this GitHub Pages website for an academic researcher. Keep it static and lightweight. Add a better hero section, cleaner publication cards, and a professional visual style. Do not add frameworks.

A second useful prompt:

> Add a dedicated Publications page, a Talks page, and a Projects page. Keep the navigation consistent and make the homepage shorter.

A third useful prompt:

> Turn the publications data into a more academic style with authors, venue, year, DOI, and buttons for paper and citation.

## Optional next upgrades

- Add a downloadable CV PDF
- Add a dedicated Projects page
- Add a Talks / Media page
- Add a small News section
- Add a custom domain later

