# ☕ The "Chaos Routine" Bot (@ExhaustedDwightBot)

An automated, serverless news agent that wakes up while you are deep in a late-night coding session, randomly samples top tech sites, extracts core article facts offline, and feeds them to an AI persona acting as an exhausted senior software engineer drinking his 4th cup of coffee.

It delivers a sarcastic morning briefing roasting tech hype, useless frameworks, and corporate AI bubbles across Telegram, Discord, a public Web Dashboard, and an RSS feed.

By combining **offline NLP pre-processing** with **Gemini 2.5 Flash synthesis**, this bot achieves lightning-fast, high-quality briefings with zero clickbait, strict topic filtering, and robust offline fallback capabilities.

## ✨ Features

- **Multi-Channel Delivery:** Broadcasts the daily briefing to Telegram and an optional Discord webhook.
- **Public Web Dashboard & API:** Automatically generates a dark-mode web dashboard (`index.html`), a static REST API (`briefing.json`), and an `rss.xml` feed.
- **Zero-Token Automated Deployment:** GitHub Actions automatically pushes the frontend files to an isolated `live-dashboard` branch, triggering Vercel's native Git integration for an instant edge deployment without requiring any authentication secrets.
- **Expanded Chaos Roulette:** Randomly selects 2 sources per run from a pool of 14 high-yield tech endpoints across software engineering, cybersecurity, AI, hardware, and nanotechnology.
- **Multi-Subreddit Mini-Roulette:** Dynamically polls top posts across `r/programming`, `r/netsec`, `r/artificial`, `r/webdev`, and `r/sysadmin`.
- **Dual-Layer Smart Filtering:** Employs an aggressive negative blocklist (e.g., politics, crime, general science) paired with a positive tech term whitelist to eliminate non-tech noise.
- **Ad-Free Clean Extraction:** Leverages `@mozilla/readability` and `jsdom` to parse raw HTML, stripping away ads, sidebars, and navigation junk.
- **Offline NLP Pre-Processing:** Uses `compromise` to extract 3 core factual sentences per article offline before touching the AI.
- **Resilient Fallback Engine:** If the Gemini API key is missing or encounters rate limits, the bot automatically falls back to sending the raw offline NLP bullet points without crashing.
- **Serverless & Free:** Automated via GitHub Actions cron schedule, running on a $0 budget.

## 🛠️ Tech Stack

- **Runtime:** Node.js (Strict ES6 Modules)
- **AI Synthesis:** `@google/generative-ai` (Gemini 2.5 Flash)
- **DOM & Content Parsing:** `jsdom`, `@mozilla/readability`, `cheerio`
- **Offline NLP:** `compromise`
- **Feeds & RSS:** `rss-parser`, `feed`
- **Config:** `dotenv`
- **Delivery:** Telegram Bot API, Discord Webhooks
- **Deployment:** Vercel Native Git Integration
- **Automation:** GitHub Actions (Cron Job)

## 🌐 Supported News Sources

- **Aggregators & Dev Communities:** Hacker News, Lobste.rs, Dev.to, InfoQ, Reddit (`r/programming`, `r/netsec`, `r/artificial`, `r/webdev`, `r/sysadmin`)
- **Cybersecurity:** BleepingComputer, Krebs on Security
- **AI & Machine Learning:** TechCrunch AI, MIT Tech Review AI
- **Hardware & Datacenters:** ServeTheHome, Phoronix
- **Engineering & Nanotech:** TechXplore, ScienceDaily Nanotech, Ars Technica Tech

## 🚀 How It Works

1. **The Wake-Up:** Every morning at 08:00 AM IST (`02:30 UTC`), GitHub Actions spins up an Ubuntu runner.
2. **The Chaos Roulette:** `src/index.js` selects two random tech feeds from the source pool and fetches trending articles.
3. **The Extraction & Filtering:** The scraper filters out non-tech titles, fetches raw HTML, and uses Mozilla's Readability engine to strip out web clutter.
4. **Offline Fact Mining:** `compromise` parses the clean text and extracts the top 3 substantive sentences per article.
5. **The Senior Engineer Roast:** Extracted facts are sent to Gemini 2.5 Flash, prompted to act like a burnt-out senior dev roasting the latest tech absurdity.
6. **The Delivery:** The sarcastic brief and formatted evidence links are posted directly to your Telegram channel and Discord webhook.
7. **The Static Generation:** A `public/` directory is built containing `index.html` (dashboard), `briefing.json` (API), and `rss.xml` (RSS feed).
8. **The Deployment:** GitHub Actions pushes the `public/` folder to a dedicated `live-dashboard` branch. Vercel natively detects the push and deploys the site to the edge network instantly.

## ⚙️ Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/telegram-news-scraper-bot.git
   cd telegram-news-scraper-bot
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Obtain API Credentials & Identifiers:**
   - **Gemini API Key:** Free key from Google AI Studio.
   - **Telegram Bot Token:** From @BotFather on Telegram.
   - **Telegram Chat ID:** Send a message to @userinfobot on Telegram to get your ID.
   - **Discord Webhook URL (Optional):** Create a webhook in your Discord server settings.

4. **Configure GitHub Repository Secrets:**
   Go to your GitHub repo → Settings → Secrets and variables → Actions and add:
   - `GEMINI_API_KEY`
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`
   - `DISCORD_WEBHOOK_URL` (Optional)

5. **Connect Vercel (Zero-Token Deployment):**
   - Go to the Actions tab in GitHub and manually trigger a run to generate the `live-dashboard` branch.
   - In Vercel, import your GitHub repository.
   - Under Build and Output Settings, override the Output Directory to `public`.
   - Click Deploy.
   - Go to your Vercel Project Settings → Git and change the Production Branch from `main` to `live-dashboard`.

## 🧪 Testing Locally

1. **Create a .env file in the root directory (ensure it is gitignored):**

   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   TELEGRAM_BOT_TOKEN=your_bot_token_here
   TELEGRAM_CHAT_ID=your_chat_id_here
   DISCORD_WEBHOOK_URL=your_discord_webhook_url_here
   ```

2. **Run the bot locally to generate the files and test APIs:**
   ```bash
   npm start
   ```

## 📝 License

MIT
