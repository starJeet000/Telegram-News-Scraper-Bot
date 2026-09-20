# Changelog

All notable changes to this project will be documented in this file.

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
