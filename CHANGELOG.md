# Changelog

All notable changes to this project will be documented in this file.

## [2.6.0] - 2026-09-23

### Added

- **Native Branch Deployment:** Pivoted to a zero-token deployment strategy. GitHub Actions now automatically commits and pushes the generated `public/` directory to an isolated `live-dashboard` branch.
- **Git History Protection:** Isolated all automated bot commits to the `live-dashboard` branch to prevent daily updates from flooding the `main` branch commit history.
- **Vercel Git Integration:** Vercel now securely builds and deploys the dashboard by natively watching the `live-dashboard` branch, completely bypassing manual CLI authentication.

### Removed

- **Vercel CLI Integration:** Completely stripped `vercel@latest` installation and deployment steps from the GitHub Actions workflow to resolve headless environment authentication errors.
- **Deployment Secrets:** Removed the requirement for `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` repository secrets.

## [2.5.0] - 2026-09-21

### Added

- **Automated Vercel Deployment:** Integrated the Vercel CLI (`vercel@latest`) into `.github/workflows/cron.yml` to automatically push the `public/` directory to Vercel's edge network on every scheduled run.
- **Vercel Authentication Secrets:** Added GitHub Actions workflow support for `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` repository secrets to securely authorize headless deployments.

### Removed

- **GitHub Pages Infrastructure:** Completely removed the `peaceiris/actions-gh-pages` deployment step and artifact routing to eliminate `gh-pages` branch clutter and configuration friction.

## [2.4.0] - 2026-09-20

### Added

- **Standardized RSS Feed Generation:** Integrated the `feed` library to automatically generate a standard `rss.xml` file inside the `public/` directory during every run, allowing subscriptions via Feedly, NetNewsWire, and other aggregators.
- **Discord Webhook Integration:** Added `src/discord.js` to optionally broadcast the morning briefing to a Discord channel. Controlled via the `DISCORD_WEBHOOK_URL` environment variable; gracefully skips execution if unconfigured.

## [2.3.0] - 2026-09-20

### Added

- **Public Web Dashboard:** Added `public/index.html` featuring a dark-mode, responsive web dashboard to render the latest briefing and evidence links.
- **Static JSON API Endpoint:** Updated `src/index.js` to automatically output structured briefing data to `public/briefing.json` on every execution.
- **GitHub Pages Automated Deployment:** Added the `peaceiris/actions-gh-pages` deployment step to `.github/workflows/cron.yml` to automatically host the web interface and static API for free on GitHub Pages.

### Changed

- **Cron Schedule Adjustment:** Updated the workflow schedule to run daily at `02:30 UTC` (08:00 AM IST) for a morning news delivery.

## [2.2.0] - 2026-09-20

### Added

- **Massive Source Expansion:** Upgraded the scraper pool from 5 sources to 14 high-yield tech endpoints, adding Lobste.rs, Dev.to, InfoQ, BleepingComputer, Krebs on Security, TechCrunch AI, MIT Tech Review AI, ServeTheHome, and Phoronix.
- **Subreddit Mini-Roulette:** Upgraded the Reddit scraper to dynamically cycle between `r/programming`, `r/netsec`, `r/artificial`, `r/webdev`, and `r/sysadmin` rather than statically polling a single subreddit.

### Changed

- **Advanced Tech Filtering:** Completely overhauled the `isTechRelated()` offline keyword filter. Implemented a dual-layer system with an aggressive negative blocklist (e.g., politics, crime, general science) and a positive tech-term whitelist (e.g., gpu, server, api) to guarantee zero off-topic bleed.

## [2.1.1] - 2026-09-20

### Fixed

- **Telegram Module Export Fix:** Resolved a `SyntaxError` in `src/index.js` by explicitly exporting `sendToTelegram` from `src/telegram.js` (while maintaining `broadcastNews` as an alias).

## [2.1.0] - 2026-09-20

### Added

- **Hybrid NLP + Gemini Pipeline:** Re-integrated the Google Gemini API (`@google/generative-ai`) to transform offline-extracted NLP facts into the signature "Exhausted Senior Engineer" sarcastic briefing.
- **Smart Tech Filtering:** Re-added Hacker News to the scraper rotation, backed by a deterministic offline keyword filter to prevent non-tech stories (e.g., biology, space, wildlife) from bleeding into the feed.
- **Offline Fallback System:** Added robust error handling in `brain.js`. If the Gemini API key is missing, invalid, or hits quota limits, the bot gracefully falls back to broadcasting the raw, offline NLP bullet points.
- **Local Environment Support:** Added the `dotenv` package to seamlessly load environment variables (API keys, tokens, chat IDs) during local testing.

### Changed

- Updated `package.json` to include `@google/generative-ai` and `dotenv` dependencies.
- Refactored `brain.js` to process the two-stage hybrid pipeline (offline fact extraction followed by Gemini persona synthesis).
- Modified `index.js` to map the offline facts and pass them effectively into the Gemini prompt.

## [2.0.0] - Previous Major Release

### Changed

- Migrated entirely to ES6 (`"type": "module"`).
- Implemented pure offline NLP extraction via `jsdom`, `@mozilla/readability`, and `compromise`.
- Removed legacy scraping methods in favor of strict, ad-free DOM parsing.
- Configured GitHub Actions automation for zero-cost deployment.
