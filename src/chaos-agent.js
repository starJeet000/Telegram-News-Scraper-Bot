import * as cheerio from 'cheerio';
import { GoogleGenerativeAI } from "@google/generative-ai";


// Environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Initialize Gemini
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// the base url for scraping hacker news
const base_url = 'https://news.ycombinator.com';

async function scrapeNews() {
  console.log("Scraping Tech News & Links...");
  try {
    const response = await fetch(base_url);
    const html = await response.text();
    const $ = cheerio.load(html);
    const topPosts = [];

    $('.titleline > a').slice(0, 10).each((i, element) => {
      const title = $(element).text();
      const rawHref = $(element).attr('href');

      //some links are relative (like Ask HN), we need to make them absolute
      const url = new URL(rawHref, base_url).href;

      topPosts.push({ title, url });
    });
    return topPosts;
  } catch (error) {
    console.error("Failed to scrape News:", error);
    return [];
  }
}

async function generateCynicalBriefing(headlines) {
  console.log("Consulting The Exhausted Engineer...");
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  // CHANGED: We map the headlines array (now objects) to just titles for the LLM
  const prompt = `
    You are a highly cynical, exhausted senior software engineer drinking his 4th cup of coffee. 
    Review these trending Hacker News headlines and give me a sarcastic, cynical morning briefing. 
    Roast the hype, the useless frameworks, and the endless AI bubble.
    Keep it to 9-10 short, punchy paragraphs.
    
    Headlines:
    ${headlines.map(h => h.title).join('\n')};
  `;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("LLM Failed:", error);
    return "The AI broke down crying. No news today. Go back to work you idiot.";
  }
}

async function sendToTelegram(message) {
  console.log("Sending Briefing to Telegram...");
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown'
      })
    });

    if (!response.ok) {
      throw new Error(`Telegram API responded with status ${response.status}`);
    }
    console.log("Message Delivered Successfully!");
  } catch (error) {
    console.error("Failed to send to Telegram:", error);
  }
}

// Main execution flow
async function runChaosRoutine() {
  const headlines = await scrapeNews();     //return [{title, url}, ....]
  if (headlines.length === 0) {
    await sendToTelegram("Scraping failed. The internet is dead. Good.");
    return;
  }

  //get the llm briefing
  const briefing = await generateCynicalBriefing(headlines);

  // CHANGED: Formulating the link list as Telegram Markdown [title](url)

  const linksSection = headlines.map((h, i) => `${i + 1}. [${h.title}](${h.url})`).join('\n');

  // CHANGED: Final combined message with AI brief + links
  const finalMessage = `☕ *The Morning Chaos Briefing*\n\n${briefing}\n\n*The Sources (If you must click):*\n${linksSection}`;


  await sendToTelegram(finalMessage);
}

runChaosRoutine();