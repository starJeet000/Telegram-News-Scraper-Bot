# ☕ The "Chaos Routine" Bot (@ExhaustedDwightBot)

An automated, serverless Telegram agent that wakes up before you do, scrapes the front page of Hacker News, and delivers a highly cynical, exhausted morning briefing about the state of the tech industry. 

Because what's better than waking up to a bot complaining about another JavaScript framework?

## 🛠️ Tech Stack
* **Runtime:** Node.js (ES6 Modules)
* **Scraper:** `cheerio` (Native `fetch` API)
* **Brain:** Google Gemini 2.5 Flash (`@google/generative-ai`)
* **Delivery:** Telegram Bot API
* **Automation:** GitHub Actions (Cron Job)

## 🚀 How it Works
1. Every morning at 02:30 UTC (Adjustable in `.github/workflows/cron.yml`), GitHub Actions spins up an Ubuntu runner.
2. The `chaos-agent.js` script scrapes the top 10 trending headlines from Hacker News.
3. The headlines are fed to Gemini, prompted to act like a burnt-out senior developer drinking their 4th cup of coffee.
4. The resulting sarcastic brief is sent directly to your phone via Telegram.
5. The runner shuts down. Total cost: $0.00.

## ⚙️ Setup Instructions

1. Clone this repository.
2. Run `npm install`.
3. Obtain your credentials:
   - **Gemini API Key:** From Google AI Studio.
   - **Telegram Bot Token:** From `@BotFather` on Telegram.
   - **Telegram Chat ID:** Message your bot, then visit `https://api.telegram.org/bot<TOKEN>/getUpdates` to find your numeric Chat ID.
4. Go to your GitHub Repository Settings -> **Secrets and variables** -> **Actions**.
5. Add the following repository secrets:
   - `GEMINI_API_KEY`
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`

## 🧪 Testing Locally
If you want to test Dwight on your own machine without waiting for the cron job, create a `.env` file in the root directory (it is gitignored):

```env
GEMINI_API_KEY=your_key_here
TELEGRAM_BOT_TOKEN=your_token_here
TELEGRAM_CHAT_ID=your_id_here
