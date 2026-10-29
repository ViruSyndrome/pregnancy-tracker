# Deploy notes (Pregnancy Week Tracker)

## Unused image folders still tracked

`assets/fruits/` (~11 MB) and `assets/growth-stages/` (~3 MB) are **not referenced** by current HTML/JS (size comparisons use `assets/week-photos/` and OpenMoji). They are listed in `.gitignore` so they are not re-added.

GitHub Pages still serves **already-tracked** files. To stop publishing them, remove them from the git tree (`git rm -r --cached assets/fruits assets/growth-stages`) and redeploy, or publish via a `/docs` folder / Action that copies only public assets.

## Other ignored tooling

`docs/`, `assets/alternativeto/`, `scratch/`, `*.py`, `indexnow-submit.ps1`, `temp_build.js`, `package.json` / `package-lock.json` — keep out of future deploys the same way.

## Keep

- `CNAME` — `www.pregnancyweektracker.com`
