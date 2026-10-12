# Ocean Design on GitHub Pages

Status: deployment configuration is prepared. A GitHub repository and account connection are still required; the site is not yet published to GitHub Pages.

## Initial publication

1. Create a GitHub repository for the portfolio. GitHub Free supports Pages from public repositories; eligible paid plans also support private source repositories.
2. Connect this project directory to that repository and push the `main` branch.
3. In the repository, open **Settings → Pages → Build and deployment → Source**, and select **GitHub Actions**.
4. Run **Publish Ocean Design** from the Actions tab if it has not started successfully, then wait for the deployment to complete.
5. Use the URL shown in the successful `github-pages` deployment. For a project repository, it normally follows `https://USERNAME.github.io/REPOSITORY/`.

The workflow uploads only `dist/`. The local source map, old hosting settings and maintenance README are excluded from Git by the allowlist in `.gitignore`.

## Future updates

Edit the existing files in this same project:

- Project text, order and asset references: `dist/content.js`
- Images and videos: `dist/assets/`
- Layout and typography: `dist/style.css`
- Interactions: `dist/app.js`

Preview the changes, then commit and push them to `main`. Each push runs the Pages workflow automatically. The published link stays the same while the account, repository name and domain remain the same. Local edits alone do not update the public site.

After the initial connection is complete, updates from this directory can use:

```sh
git add dist .github .gitignore DEPLOYMENT.md
git commit -m "Update portfolio"
git push origin main
```

The update is public once the Actions deployment succeeds. Visitors may need to refresh an already-open page to see it.

Source: [GitHub Pages custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
