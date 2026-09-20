# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2026-09-20

### Added

- **Offline NLP Summarization:** Integrated `compromise` to deterministically extract the top 3 core sentences from articles, replacing unpredictable AI-generated summaries.
- **Robust Text Extraction:** Added `@mozilla/readability` and `jsdom` to strip ads, sidebars, and junk HTML, ensuring only pure article text is processed.
- **ES6 Module Support:** Added `"type": "module"` to `package.json` to enforce modern JavaScript standards.
- **Graceful Error Handling:** Implemented `try...catch` blocks in the main execution loop to gracefully skip articles if the scraper is blocked (e.g., by Cloudflare 403 errors).
- **GitHub Actions Workflow Dispatch:** Added the `workflow_dispatch` trigger to `.github/workflows/cron.yml` to allow manual testing from the GitHub UI.

### Changed

- **Codebase Modernization:** Refactored all Node.js files (`index.js`, `brain.js`, `scrapers.js`, `telegram.js`) to use `import`/`export` syntax instead of legacy `require()`.
- **Telegram Formatting:** Shifted all message formatting logic directly into `telegram.js` to separate concerns, resulting in a cleaner Markdown output with inline source links.

### Removed

- **Gemini AI Dependencies:** Stripped out `@google/generative-ai` and removed all LLM-related logic to guarantee a 100% free, zero-hallucination workflow.
- **BotFather Polling:** Removed active server requirements. The bot now runs efficiently as a scheduled one-off script.

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
