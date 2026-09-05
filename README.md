# CyberKids

An interactive cyber-safety adventure for kids ages **6–10**, hosted on GitHub Pages.

## What kids learn

1. **Share with Care** — keep personal info private  
2. **Secret Keys** — build strong, silly passwords  
3. **Don’t Fall for Fake** — spot tricks and “computer germs”  
4. **Be Kind Online** — kind words and getting help  
5. **Ask for Help** — brave means telling a trusted adult  

Each zone has a short lesson, a mini-game, and a quiz. Non-human character guides (Shieldo, Privy, Keyora, Spotter, Spark, Beacon) coach along the way.

## Privacy

- No accounts, no analytics, no personal data collection  
- Progress and sound preference stay in the browser (`localStorage`)  
- Explorer names are random fun nicknames (not real names)

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy (GitHub Pages)

Push to `main`. The workflow in `.github/workflows/deploy-pages.yml` builds and publishes the site to:

`https://<your-username>.github.io/cyberkids/`

Enable **Settings → Pages → Source: GitHub Actions** if it is not already set.
