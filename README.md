# ☕ The "Chaos Routine" Bot (@ExhaustedDwightBot) - A Telegram News Scraper Bot (Offline NLP Edition)

An automated, serverless Telegram agent that wakes up while you are deep in a late-night coding session, randomly samples the front pages of major tech sites, and delivers a highly rigid, deterministic briefing about the state of the tech industry.
Built entirely with offline NLP—because true developers don't rely on third-party APIs that hallucinate about JavaScript frameworks.

A lightweight, 100% free Node.js bot that scrapes trending tech news, strips away ads and junk HTML, summarizes the core facts using local Natural Language Processing (NLP), and broadcasts a clean briefing to a Telegram channel.

By bypassing third-party LLMs and running purely on GitHub Actions, this bot guarantees **zero API costs, zero hallucinations, and zero maintenance.**

## ✨ Features

- **Chaos Roulette Scraper:** Randomly selects 2 tech sources (Hacker News, GitHub Trending, Reddit, Slashdot, Ars Technica, TechCrunch) per run.
- **Offline NLP Summarization:** Uses `compromise` to extract the most substantive sentences directly from the article body. No AI APIs required.
- **Ad-Free Extraction:** Leverages Firefox's `@mozilla/readability` and `jsdom` to parse raw HTML and extract only the actual journalistic content.
- **Serverless & Free:** Designed to run on a GitHub Actions Cron schedule, costing $0 in hosting fees.

## 🛠 Tech Stack

- **Node.js** (ES6 Modules)
- **DOM Parsing:** `jsdom`, `cheerio`
- **Content Extraction:** `@mozilla/readability`
- **NLP Processing:** `compromise`
- **RSS Parsing:** `rss-parser`

## 🚀 Local Development Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/telegram-news-scraper-bot.git
   cd telegram-news-scraper-bot
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory (or export them to your terminal):

   ```env
   TELEGRAM_BOT_TOKEN=your_bot_token_from_botfather
   TELEGRAM_CHAT_ID=your_target_channel_or_chat_id
   ```

4. **Run the bot:**
   ```bash
   npm start
   ```

## ☁️ Free Deployment via GitHub Actions

This bot is pre-configured to run automatically every 6 hours using GitHub Actions. To set this up on your fork:

1. Go to your GitHub repository's **Settings**.
2. Navigate to **Secrets and variables > Actions**.
3. Add a **New repository secret** named `TELEGRAM_BOT_TOKEN` with your bot's token.
4. Add another secret named `TELEGRAM_CHAT_ID` with the ID of the chat/channel you want the bot to post to.
5. Go to the **Actions** tab in your repo, enable workflows, and you can manually trigger it clicking **Run workflow** on the "Offline News Scraper" action.

## 📝 License

MIT
