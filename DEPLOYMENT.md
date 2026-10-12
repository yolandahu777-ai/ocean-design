# Ocean Design on GitHub Pages

Published to GitHub Pages on **2026-10-12**.

- Website: [Ocean Design](https://yolandahu777-ai.github.io/ocean-design/)
- Repository: [yolandahu777-ai/ocean-design](https://github.com/yolandahu777-ai/ocean-design)

## Deployment configuration

The **Publish Ocean Design** workflow in `.github/workflows/deploy-pages.yml` runs automatically when changes are pushed to `main`. It can also be started manually from the repository's Actions tab. GitHub Pages uses **GitHub Actions** as its build and deployment source.

The workflow uploads only `dist/`. The local source map, old hosting settings and maintenance README are excluded from Git by the allowlist in `.gitignore`.

## Future updates

Edit the existing files in this same project:

- Project text, order and asset references: `dist/content.js`
- Images and videos: `dist/assets/`
- Layout and typography: `dist/style.css`
- Interactions: `dist/app.js`

Preview the changes, then commit and push them to `main`. Each push runs the Pages workflow automatically. The published link stays the same while the account, repository name and domain remain the same. Local edits alone do not update the public site.

To publish future updates from this project directory:

```sh
git add dist .github .gitignore DEPLOYMENT.md
git commit -m "Update portfolio"
git push origin main
```

The update is public once the Actions deployment succeeds. Visitors may need to refresh an already-open page to see it.

Source: [GitHub Pages custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
