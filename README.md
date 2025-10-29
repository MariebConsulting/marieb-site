
# Marieb Site (Vite + React + TS + Tailwind)

**What this is:** a ready-to-deploy project containing your `Marieb_Site_Dark_V8.tsx` as `src/App.tsx`,
a GitHub Pages deploy workflow, and a `public/CNAME` placeholder for your custom domain.

## Quickstart
```bash
npm i
npm run dev
# edit vite.config.ts base to '/' once you add a custom domain
```

## Build
```bash
npm run build
```

## Deploy to GitHub Pages
1. Create a new GitHub repo and push these files (main branch).
2. Edit `vite.config.ts`:
   - If you **do not** use a custom domain: set `base` to `'/REPO_NAME/'`.
   - If you **do** use a custom domain with `public/CNAME`: set `base` to `'/'`.
3. GitHub → Settings → Pages → **Build and deployment**: Source = "GitHub Actions" (this workflow).
4. On push to `main`, the site builds to `dist` and auto-deploys.

## Custom Domain
- Put your real domain into `public/CNAME` (single line).
- DNS: 
  - For `www.yourdomain.com`: CNAME → `<your-username>.github.io`.
  - For apex/root (`yourdomain.com`): A → 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
    (optional AAAA for IPv6: 2606:50c0:8000::153, 2606:50c0:8001::153, 2606:50c0:8002::153, 2606:50c0:8003::153)
- In your repo, GitHub → Settings → Pages → add the custom domain and enforce HTTPS.

## Google Apps Script endpoint
- In `src/App.tsx`, find:
  ```ts
  const WEB_APP_URL = 'YOUR_WEB_APP_URL_HERE'
  ```
- Replace with your Apps Script Web App URL that writes to Google Sheets.

## Tailwind
- Styles live in `src/index.css`. Tailwind scans `./index.html` and `./src/**/*.{ts,tsx}`.

---

**Note:** The build workflow is in `.github/workflows/pages.yml`.
