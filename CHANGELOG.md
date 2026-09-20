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
