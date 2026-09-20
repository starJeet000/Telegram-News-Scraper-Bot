# ☕ The "Chaos Routine" Bot (@ExhaustedDwightBot)

An automated, serverless Telegram agent that wakes up while you are deep in a late-night coding session, randomly samples top tech sites, extracts core article facts offline, and feeds them to an AI persona acting as an exhausted senior software engineer drinking his 4th cup of coffee.
It delivers a sarcastic morning briefing roasting tech hype, useless frameworks, and corporate AI bubbles—complete with evidence links.
By combining **offline NLP pre-processing** with **Gemini 2.5 Flash synthesis**, this bot achieves lightning-fast, high-quality briefings with zero clickbait, smart topic filtering, and robust offline fallback capabilities.

## ✨ Features

- **Chaos Roulette & Smart Tech Filter:** Randomly selects 2 sources per run (Hacker News, r/programming, TechXplore, ScienceX Nanotech, Ars Technica, TechCrunch). Includes a strict keyword filter to discard non-tech noise (biology, archaeology, wildlife).
- **Ad-Free Clean Extraction:** Leverages `@mozilla/readability` and `jsdom` to parse raw HTML, stripping away ads, sidebars, and navigation junk.
- **Offline NLP Pre-Processing:** Uses `compromise` to extract 3 core factual sentences per article offline before touching the AI.
- **Exhausted Developer Persona:** Feeds extracted facts to Google Gemini 2.5 Flash to synthesize a witty, cynical, 3-4 paragraph briefing.
- **Resilient Fallback Engine:** If the Gemini API key is missing or encounters rate limits, the bot automatically falls back to sending the raw offline NLP bullet points without crashing.
- **Serverless & Free:** Automated via GitHub Actions cron schedule, running on a $0 budget.

## 🛠️ Tech Stack

- **Runtime:** Node.js (Strict ES6 Modules)

- **AI Synthesis:** `@google/generative-ai` (Gemini 2.5 Flash)

- **DOM & Content Parsing:** `jsdom`, `@mozilla/readability`, `cheerio`

- **Offline NLP:** `compromise`

- **RSS Parsing:** `rss-parser`

- **Config:** `dotenv`

- **Delivery:** Telegram Bot API

- **Automation:** GitHub Actions (Cron Job)

## 🚀 How It Works

1. **The Wake-Up:** Every 6 hours (adjustable in `.github/workflows/cron.yml`), GitHub Actions spins up an Ubuntu runner.
2. **The Chaos Roulette:** `src/index.js` selects two random tech feeds and fetches trending articles.
3. **The Extraction & Filtering:** The scraper filters out non-tech titles, fetches raw HTML, and uses Mozilla's Readability engine to strip out web clutter.
4. **Offline Fact Mining:** `compromise` parses the clean text and extracts the top 3 substantive sentences per article.
5. **The Senior Engineer Roast:** Extracted facts are sent to Gemini 2.5 Flash, prompted to act like a burnt-out senior dev roasting the latest tech absurdity.
6. **The Delivery:** The sarcastic brief and formatted evidence links are posted directly to your Telegram channel.
7. **The Sleep:** The runner shuts down. Total cost: $0.00.

## ⚙️ Setup Instructions

1. **Clone the repository:**

   Bash
   ```
   git clone https://github.com/yourusername/telegram-news-scraper-bot.git
   cd telegram-news-scraper-bot

   ```
2. **Install dependencies:**

   Bash
   ```
   npm install

   ```
3. **Obtain API Credentials:**
   - **Gemini API Key:** Free key from Google AI Studio.
   - **Telegram Bot Token:** From `@BotFather` on Telegram.
   - **Telegram Chat ID:** Send a message to `@userinfobot` on Telegram to get your ID.
4. **Configure GitHub Repository Secrets:**
   Go to your GitHub repo -> **Settings** -> **Secrets and variables** -> **Actions** and add:
   - `GEMINI_API_KEY`
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`

## 🧪 Testing Locally

Create a `.env` file in the root directory (ensure it is gitignored):
Code snippet

```
GEMINI_API_KEY=your_gemini_api_key_here
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here

```

Run the bot locally:
Bash

```
npm start

```

## 📝 License

MIT
