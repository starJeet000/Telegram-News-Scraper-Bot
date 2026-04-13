# ☕ The "Chaos Routine" Bot (@ExhaustedDwightBot)

An automated, serverless Telegram agent that wakes up before you do, randomly samples the front pages of major tech sites, and delivers a highly cynical, exhausted morning briefing about the state of the tech industry. 

Because what's better than waking up to a bot complaining about another JavaScript framework?

## 🛠️ Tech Stack

* **Runtime:** Node.js (ES6 Modules)
* **Scrapers:** `cheerio` (HTML parsing) & `rss-parser` (XML feeds)
* **Brain:** Google Gemini 2.5 Flash (`@google/generative-ai`)
* **Delivery:** Telegram Bot API
* **Automation:** GitHub Actions (Cron Job)

## 🚀 How it Works

1. **The Wake-Up:** Every morning at 02:30 UTC (Adjustable in `.github/workflows/cron.yml`), GitHub Actions spins up an Ubuntu runner.

2. **The Chaos Roulette:** The `src/index.js` script randomly selects two sources from a pool of six (Hacker News, GitHub Trending, Reddit r/programming, Slashdot, Ars Technica, TechCrunch) and scrapes the top trending posts.

3. **The Roast:** The headlines are fed to Gemini, prompted to act like a burnt-out senior developer drinking their 4th cup of coffee.

4. **The Delivery:** The resulting sarcastic brief, complete with clickable source links, is sent directly to your phone via Telegram.

5. **The Sleep:** The runner shuts down. Total cost: $0.00.

## ⚙️ Setup Instructions

1. Clone this repository.

2. Run `npm install` to install dependencies.

3. Obtain your credentials:
   - **Gemini API Key:** From Google AI Studio.
   - **Telegram Bot Token:** From `@BotFather` on Telegram.
   - **Telegram Chat ID:** Search for `@userinfobot` on Telegram, send it a message, and copy your numeric `Id`.

4. Go to your GitHub Repository Settings -> **Secrets and variables** -> **Actions**.

5. Add the following repository secrets:
   - `GEMINI_API_KEY`
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`

## 🧪 Testing Locally

If you want to test Dwight on your own machine without waiting for the cron job:

1. Create a `.env` file in the root directory (ensure it is gitignored):

```env
GEMINI_API_KEY=your_key_here
TELEGRAM_BOT_TOKEN=your_token_here
TELEGRAM_CHAT_ID=your_id_here