import * as cheerio from 'cheerio';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { log } from 'node:console';

//environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

//Initialize gemini
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

async function scrapeNews() {
  console.log("Scraping Tech News...");

  try {
    const response = await fetch('https://news.ycombinator.com');
    const html = await response.text();
    const $ = cheerio.load(html);

    const topPosts = [];

    //Extract top 10 headlines;
    $('.titleline > a').slice(0, 10).each((i, element) => {
      topPosts.push($(element).text());
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

  const prompt = `
  You are a highly cynical, exhausted senior software engineer who has been building CRUD apps for too long. 
    You are drinking your 4th cup of coffee. 
    Review these top trending Hacker News headlines and give me a brief, sarcastic, and cynical morning briefing. 
    Roast the obsession with new frameworks, AI hype, and hustle culture if applicable. 
    Keep it to 3-4 short paragraphs.
    
    Headlines:
    ${headlines.join('\n')}
    `;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("LLM Failed to generate briefing:", error);
    return "The AI broke down crying. No news today. You have other things to do.";
  }

};

async function sendToTelegram(message) {
  console.log("Sending Briefing to Telegram...");
  const url = `https://api.telegram.org/bot8669490117:AAHX62xGax8nlN4kunqRBOrQ4U81H8NuawU/getUpdates`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_code: 'Markdown'    //allows llm to format with bold/italic
      })

    });

    if (!response.ok) {
      throw new Error(`Telegram API responded with status ${response.status}`);
    }
    console.log("Message Delivered Successfully!");

  } catch (error) {
    console.error("Failed to send to Telegram:", error);
  }

};

//Main Flow

async function runChaosRoutine() {
  const headlines = await scrapeNews();

  if (headlines.length == 0) {
    await sendToTelegram("Scraping failed. The internet is dead. Good News");
    return;
  }

  const briefing = generateCynicalBriefing(headlines);
  await sendToTelegram(`☕ *Morning Chaos Briefing*\n\n${briefing}`);
};

runChaosRoutine();
