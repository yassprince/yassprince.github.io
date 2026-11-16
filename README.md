# For Maha, Always

A romantic, interactive love letter made for Maha. It is a static site with no database, backend, authentication, or build dependency.

## Run locally

```bash
python3 -m http.server 3000
```

Then open `http://localhost:3000`.

## Publish with GitHub Pages

1. Create a GitHub repository and upload the contents of this folder.
2. In **Settings → Pages**, choose **GitHub Actions** as the source.
3. The included workflow at `.github/workflows/pages.yml` will build and publish the site.

You can also publish the repository root directly through **Settings → Pages → Deploy from a branch**, using the `main` branch and the `/ (root)` folder.
